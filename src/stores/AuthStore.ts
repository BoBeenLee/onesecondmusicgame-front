import _ from "lodash";
import KakaoLogin from "@react-native-seoul/kakao-login";
import { flow, types } from "mobx-state-tree";
import {
  GoogleSignin,
  statusCodes
} from "@react-native-community/google-signin";
import firebase, { RNFirebase, AuthCredential } from "react-native-firebase";
import { LoginManager, AccessToken } from "react-native-fbsdk";
import appleAuth, {
  AppleAuthRealUserStatus,
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthError
} from "@invertase/react-native-apple-authentication";

import { defaultItemToString, FIELD, setItem } from "src/utils/storage";
import { signInUsingPOST, signUpUsingPOST } from "src/apis/user";
import { getUniqueID } from "src/utils/device";
import User from "src/stores/model/User";
import { ErrorCode } from "src/configs/error";
import { findItemAllUsingGET } from "src/apis/item";
import { setUserID } from "src/configs/analytics";
import { LoggedInMusicUser } from "__generate__/api";

export type AUTH_PROVIDER = "APPLE" | "KAKAO" | "GOOGLE" | "FACEBOOK" | "NONE";

const AuthStore = types
  .model("AuthStore", {
    provider: types.frozen<AUTH_PROVIDER>("NONE"),
    accessId: types.optional(types.string, ""),
    accessToken: types.optional(types.string, ""),
    refreshToken: types.optional(types.string, ""),
    user: types.optional(types.maybeNull(User), null)
  })
  .views(self => {
    return {
      get isGuest() {
        return self.provider === "NONE";
      }
    };
  })
  .actions(self => {
    const clear = () => {
      self.provider = "NONE";
      self.accessId = "";
      self.accessToken = "";
      self.refreshToken = "";
      self.user = null;
    };

    const clearIfProviderExpiredToken = flow(function*() {
      GoogleSignin.configure();
      switch (self.provider) {
        case "GOOGLE":
          const isSignedIn = yield GoogleSignin.isSignedIn();
          if (!isSignedIn) {
            clear();
            return;
          }
          return;
        case "KAKAO":
          return;
      }
    });

    const makeUserIfProviderExists = () => {
      self.user = User.create({
        accessId: self.accessId,
        nickname: ""
      });
    };

    const initialize = flow(function*() {
      const [
        provider,
        accessId,
        accessToken,
        refreshToken
      ] = yield Promise.all([
        defaultItemToString(FIELD.PROVIDER_TYPE, "NONE"),
        defaultItemToString(FIELD.ACCESS_ID, ""),
        defaultItemToString(FIELD.ACCESS_TOKEN, ""),
        defaultItemToString(FIELD.REFRESH_TOKEN, "")
      ]);
      self.provider = provider;
      self.accessId = accessId;
      self.accessToken = accessToken;
      self.refreshToken = refreshToken;
      yield clearIfProviderExpiredToken();
      if (self.provider === "NONE") {
        return;
      }
      makeUserIfProviderExists();
      try {
        yield signIn();
      } catch (error) {
        // NOTHING
        clear();
      }
    });

    const kakaoSignIn = flow(function*() {
      const tokenResponse: RetrieveAsyncFunc<typeof KakaoLogin.login> = yield KakaoLogin.login();
      const profileResponse: RetrieveAsyncFunc<typeof KakaoLogin.getProfile> = yield KakaoLogin.getProfile();

      self.accessId = profileResponse.id;
      self.accessToken = tokenResponse.accessToken;
      self.provider = "KAKAO";
      self.user = User.create({
        accessId: self.accessId
      });
      yield signIn();
    });

    const googleSignIn = flow(function*() {
      try {
        const userInfo: RetrieveAsyncFunc<typeof GoogleSignin.signIn> = yield GoogleSignin.signIn();
        const tokenInfo: RetrieveAsyncFunc<typeof GoogleSignin.getTokens> = yield GoogleSignin.getTokens();

        const credential = firebase.auth.GoogleAuthProvider.credential(
          tokenInfo.idToken,
          tokenInfo.accessToken
        );
        const firebaseUserCredential: RetrieveAsyncFunc<(
          credential: AuthCredential
        ) => Promise<
          RNFirebase.UserCredential
        >> = yield firebase.auth().signInWithCredential(credential);

        self.accessId = userInfo.user.id;
        self.accessToken = tokenInfo.accessToken;
        self.provider = "GOOGLE";
        self.user = User.create({
          accessId: self.accessId
        });
        yield signIn();
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
          throw error;
        } else if (error.code === statusCodes.IN_PROGRESS) {
          // operation (e.g. sign in) is in progress already
          throw error;
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // play services not available or outdated
          throw error;
        } else {
          throw error;
        }
      }
    });

    const facebookSignIn = flow(function*() {
      const result: RetrieveAsyncFunc<typeof LoginManager.logInWithPermissions> = yield LoginManager.logInWithPermissions(
        ["public_profile"]
      );
      if (result.isCancelled) {
        throw new Error("Login cancelled");
      }
      const data: RetrieveAsyncFunc<typeof AccessToken.getCurrentAccessToken> = yield AccessToken.getCurrentAccessToken();
      if (!Boolean(data?.accessToken)) {
        throw new Error("not exists facebook token");
      }
      self.accessId = data?.userID ?? "";
      self.accessToken = data?.accessToken?.toString?.() ?? "";
      self.provider = "FACEBOOK";
      self.user = User.create({
        accessId: self.accessId
      });
      yield signIn();
    });

    const appleSignIn = flow(function*() {
      const appleAuthRequestResponse: RetrieveAsyncFunc<typeof appleAuth.performRequest> = yield appleAuth.performRequest(
        {
          requestedOperation: AppleAuthRequestOperation.LOGIN,
          requestedScopes: [
            AppleAuthRequestScope.EMAIL,
            AppleAuthRequestScope.FULL_NAME
          ]
        }
      );

      const {
        user,
        email,
        nonce,
        identityToken,
        realUserStatus /* etc */
      } = appleAuthRequestResponse;
      const credentialStateResponse: RetrieveAsyncFunc<typeof appleAuth.getCredentialStateForUser> = yield appleAuth.getCredentialStateForUser(
        user
      );

      if (!identityToken) {
        throw new Error("not exists identityToken");
      }
      if (credentialStateResponse !== AppleAuthCredentialState.AUTHORIZED) {
        throw new Error("not AUTHORIZED");
      }
      self.accessId = user;
      self.accessToken = identityToken;
      self.provider = "APPLE";
      self.user = User.create({
        accessId: self.accessId
      });
      yield signIn();
    });

    const signIn = flow(function*() {
      const signInResponse: RetrieveAsyncFunc<typeof signInUsingPOST> = yield signInUsingPOST(
        {
          accessId: self.accessId,
          accessToken: self.accessToken
        }
      );
      updateUserAccessToken(signInResponse);
      updateUserInfo(signInResponse);
      updateAuthInfo();
    });

    const signUp = flow(function*({ nickname }: { nickname: string }) {
      const deviceId = getUniqueID();
      const sharedAccessId = yield defaultItemToString(
        FIELD.SHARED_ACCESS_ID,
        ""
      );
      yield signUpUsingPOST({
        accessId: self.accessId,
        deviceId: deviceId,
        nickname,
        socialType: self.provider,
        ...(sharedAccessId ? { invitedBy: sharedAccessId } : {})
      });
      const signInResponse: RetrieveAsyncFunc<typeof signInUsingPOST> = yield signInUsingPOST(
        {
          accessId: self.accessId,
          accessToken: self.accessToken
        }
      );
      updateUserAccessToken(signInResponse);
      updateUserInfo(signInResponse);
      updateAuthInfo();
    });

    const updateUserAccessToken = (
      signInResponse: LoggedInMusicUser | null
    ) => {
      if (!signInResponse?.token) {
        throw new Error("sign in Error!");
      }
      self.user?.setUserAccessToken(signInResponse.token);
    };

    const updateUserInfo = flow(function*(signInResponse: LoggedInMusicUser) {
      const response: RetrieveAsyncFunc<typeof findItemAllUsingGET> = yield findItemAllUsingGET();
      self.user?.setNickname(signInResponse?.nickname ?? "");
      self.user?.setUserItems(response);
      self.user?.heart.fetchHeart();
      setUserID(self.accessId);
    });

    const updateUserReward = () => {
      self.user?.heart.fetchHeart();
    };

    const updateAuthInfo = () => {
      setItem(FIELD.ACCESS_ID, self.accessId);
      setItem(FIELD.ACCESS_TOKEN, self.accessToken);
      setItem(FIELD.PROVIDER_TYPE, self.provider);
    };

    const signOut = () => {
      clear();
    };

    return {
      initialize,
      appleSignIn,
      facebookSignIn,
      updateUserReward,
      updateUserInfo,
      kakaoSignIn,
      googleSignIn,
      signOut,
      signUp
    };
  });

export type IAuthStore = typeof AuthStore.Type;
export default AuthStore;
