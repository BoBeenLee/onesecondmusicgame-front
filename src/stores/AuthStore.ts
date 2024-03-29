import _ from "lodash";
import KakaoLogin from "@react-native-seoul/kakao-login";
import { flow, types } from "mobx-state-tree";
import {
  GoogleSignin,
  statusCodes
} from "@react-native-community/google-signin";
import { LoginManager, AccessToken } from "react-native-fbsdk";
import appleAuth, {
  AppleAuthRealUserStatus,
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthError
} from "@invertase/react-native-apple-authentication";

import { storage } from "src/utils/storage";
import {
  signInUsingPOST,
  signUpUsingPOST,
  myInfoChangeUsingPUT
} from "src/apis/user";
import { getUniqueID } from "src/configs/device";
import User from "src/stores/model/User";
import { findItemAllUsingGET } from "src/apis/item";
import { setUserID } from "src/configs/analytics";
import { LoggedInMusicUser } from "__generate__/api";

export type AUTH_PROVIDER = "APPLE" | "KAKAO" | "GOOGLE" | "FACEBOOK" | "NONE";

const DEFAULT_SOUND_CLIEND_ID = "8VYpK2wS7aOYHwRFi4wZE1P51Z00WaeR";

const AuthStore = types
  .model("AuthStore", {
    provider: types.frozen<AUTH_PROVIDER>("NONE"),
    accessId: types.optional(types.string, ""),
    accessToken: types.optional(types.string, ""),
    soundCloudCliendId: types.optional(types.string, DEFAULT_SOUND_CLIEND_ID),
    refreshToken: types.optional(types.string, ""),
    user: types.optional(types.maybeNull(User), null)
  })
  .views(self => {
    return {
      get isGuest() {
        return self.provider === "NONE";
      },
      get socialType() {
        const byType: Record<AUTH_PROVIDER, string> = {
          APPLE: "애플 연동됨",
          KAKAO: "카카오 연동됨",
          GOOGLE: "Google 연동됨",
          FACEBOOK: "페이스북 연동됨",
          NONE: ""
        };
        return byType[self.provider];
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
      const {
        provider,
        accessId,
        accessToken,
        refreshToken
      } = yield storage().getToken();

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
      try {
        const tokenResponse: RetrieveAsyncFunc<typeof KakaoLogin.login> = yield KakaoLogin.login();
        const profileResponse: RetrieveAsyncFunc<typeof KakaoLogin.getProfile> = yield KakaoLogin.getProfile();

        self.accessId = profileResponse.id;
        self.accessToken = tokenResponse.accessToken;
        self.provider = "KAKAO";
        self.user = User.create({
          accessId: self.accessId
        });
        yield signIn();
        return true;
      } catch (error) {
        if (error.code === "E_CANCELLED_OPERATION") {
          return false;
        }
        throw error;
      }
    });

    const googleSignIn = flow(function*() {
      try {
        const userInfo: RetrieveAsyncFunc<typeof GoogleSignin.signIn> = yield GoogleSignin.signIn();
        const tokenInfo: RetrieveAsyncFunc<typeof GoogleSignin.getTokens> = yield GoogleSignin.getTokens();

        self.accessId = userInfo.user.id;
        self.accessToken = tokenInfo.accessToken;
        self.provider = "GOOGLE";
        self.user = User.create({
          accessId: self.accessId
        });
        yield signIn();
        return true;
      } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
          // throw error;
          return false;
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
        // throw new Error("Login cancelled");
        return false;
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
      return true;
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
      return true;
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
      updateAuthInfo(signInResponse);
    });

    const signUp = flow(function*({ nickname }: { nickname: string }) {
      const deviceId = getUniqueID();
      const sharedAccessId = yield storage().getSharedAccessId();
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
      updateAuthInfo(signInResponse);
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
      self.user?.setNickname(signInResponse?.nickname ?? "");
      self.user?.setProfileImageUrl(signInResponse?.profileImageUrl ?? "");
      yield updateUserReward();
      self.user?.heart.fetchHeart();
      setUserID(self.accessId);
    });

    const updateUser = flow(function*({ nickname }: { nickname: string }) {
      self.user?.setNickname(nickname);
      yield myInfoChangeUsingPUT({ newNickname: nickname });
    });

    const updateUserReward = flow(function*() {
      const response: RetrieveAsyncFunc<typeof findItemAllUsingGET> = yield findItemAllUsingGET();
      self.user?.setUserItems(response);
    });

    const updateAuthInfo = (signInResponse: LoggedInMusicUser | null) => {
      self.soundCloudCliendId =
        signInResponse?.clientId ?? DEFAULT_SOUND_CLIEND_ID;
      storage().saveToken({
        provider: self.provider,
        accessId: self.accessId,
        accessToken: self.accessToken,
        refreshToken: ""
      });
    };

    const signOut = () => {
      clear();
      updateAuthInfo(null);
    };

    return {
      initialize,
      appleSignIn,
      facebookSignIn,
      updateUser,
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
