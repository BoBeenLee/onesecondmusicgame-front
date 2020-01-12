import _ from "lodash";
import KakaoLogin from "@react-native-seoul/kakao-login";
import { flow, types } from "mobx-state-tree";
import {
  GoogleSignin,
  statusCodes
} from "@react-native-community/google-signin";
import firebase, { RNFirebase, AuthCredential } from "react-native-firebase";
import { LoginManager, AccessToken } from "react-native-fbsdk";

import { defaultItemToString, FIELD, setItem } from "src/utils/storage";
import {
  userControllerApi,
  signInUsingPOST,
  IUserLoginResponse
} from "src/apis/user";
import { getUniqueID } from "src/utils/device";
import User from "src/stores/model/User";
import { ErrorCode } from "src/configs/error";
import { findItemAllUsingGET } from "src/apis/item";
import { setUserID } from "src/configs/analytics";

export type AUTH_PROVIDER = "KAKAO" | "GOOGLE" | "FACEBOOK" | "NONE";

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
      self.provider = yield defaultItemToString(FIELD.PROVIDER_TYPE, "NONE");
      self.accessId = yield defaultItemToString(FIELD.ACCESS_ID, "");
      self.accessToken = yield defaultItemToString(FIELD.ACCESS_TOKEN, "");
      self.refreshToken = yield defaultItemToString(FIELD.REFRESH_TOKEN, "");
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
        accessId: self.accessId,
        nickname: profileResponse.nickname
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
          accessId: self.accessId,
          nickname: userInfo.user.name ?? userInfo.user.email
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
        accessId: self.accessId,
        nickname: data?.userID ?? ""
      });
      yield signIn();
    });

    const signIn = flow(function*() {
      try {
        const signInResponse: RetrieveAsyncFunc<typeof signInUsingPOST> = yield signInUsingPOST(
          {
            accessId: self.accessId,
            accessToken: self.accessToken
          }
        );
        updateUserAccessToken(signInResponse);
        updateUserInfo();
        updateAuthInfo();
      } catch (error) {
        if (
          [ErrorCode.NOT_FOUND, ErrorCode.FORBIDDEN_ERROR].some(
            status => status === error.status
          )
        ) {
          yield fallbackSignUpAndSignIn();
          return;
        }
        throw error;
      }
    });

    const fallbackSignUpAndSignIn = flow(function*() {
      const deviceId = getUniqueID();
      const sharedAccessId = yield defaultItemToString(
        FIELD.SHARED_ACCESS_ID,
        ""
      );
      yield userControllerApi.signUpUsingPOST({
        accessId: self.accessId,
        deviceId: deviceId,
        nickname: self.user?.nickname ?? self.accessId,
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
      updateUserInfo();
      updateAuthInfo();
    });

    const updateUserAccessToken = (
      signInResponse: IUserLoginResponse | null
    ) => {
      if (!signInResponse) {
        throw new Error("sign in Error!");
      }
      self.user?.setUserAccessToken(signInResponse.body.token);
    };

    const updateUserInfo = flow(function*() {
      const response: RetrieveAsyncFunc<typeof findItemAllUsingGET> = yield findItemAllUsingGET();
      self.user?.setUserItems(response.body);
      self.user?.heart.fetchHeart();
      setUserID(self.accessId);
    });

    const updateAuthInfo = flow(function*() {
      setItem(FIELD.ACCESS_ID, self.accessId);
      setItem(FIELD.ACCESS_TOKEN, self.accessToken);
      setItem(FIELD.PROVIDER_TYPE, self.provider);
    });

    const signOut = () => {
      clear();
    };

    return {
      initialize,
      facebookSignIn,
      updateUserInfo,
      kakaoSignIn,
      googleSignIn,
      signOut
    };
  });

export type IAuthStore = typeof AuthStore.Type;
export default AuthStore;
