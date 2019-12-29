import _ from "lodash";
import KakaoLogin from "@react-native-seoul/kakao-login";
import { flow, getRoot, Instance, types } from "mobx-state-tree";
import {
  GoogleSignin,
  statusCodes
} from "@react-native-community/google-signin";
import firebase, { RNFirebase, AuthCredential } from "react-native-firebase";

import { getRootStore } from "src/stores/StoreHelper";
export type AUTH_PROVIDER = "KAKAO" | "GOOGLE" | "EMAIL" | "NONE";

const AuthStore = types
  .model("AuthStore", {
    provider: types.frozen<AUTH_PROVIDER>("NONE"),
    accessId: types.optional(types.string, ""),
    accessToken: types.optional(types.string, ""),
    refreshToken: types.optional(types.string, "")
  })
  .views(self => {
    return {
      get isGuest() {
        return self.provider === "NONE";
      }
    };
  })
  .actions(self => {
    const rootStore = getRootStore(self);

    const clear = () => {
      self.provider = "NONE";
      self.accessId = "";
      self.accessToken = "";
      self.refreshToken = "";
    };

    const initialize = flow(function*() {
      GoogleSignin.configure();

      switch (self.provider) {
        case "GOOGLE":
          const isSignedIn = yield GoogleSignin.isSignedIn();
          if (!isSignedIn) {
            clear();
          }
          return;
        case "KAKAO":
          return;
      }
    });

    const kakaoSignIn = flow(function*() {
      try {
        const tokenResponse: RetrieveAsyncFunc<typeof KakaoLogin.login> = yield KakaoLogin.login();
        const profileResponse: RetrieveAsyncFunc<typeof KakaoLogin.getProfile> = yield KakaoLogin.getProfile();

        self.accessId = profileResponse.id;
        self.accessToken = tokenResponse.accessToken;
        self.provider = "KAKAO";
      } catch (error) {
        rootStore.toastStore.showToast(error.message);
      }
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
      } catch (error) {
        rootStore.toastStore.showToast(error.message);
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
        } else if (error.code === statusCodes.IN_PROGRESS) {
          // operation (e.g. sign in) is in progress already
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // play services not available or outdated
        } else {
          // some other error happened
        }
      }
    });

    const emailSignIn = () => {
      // TODO
    };

    const signOut = () => {
      // TODO
    };

    return {
      initialize,
      kakaoSignIn,
      googleSignIn,
      emailSignIn,
      signOut
    };
  });

export type IAuthStore = typeof AuthStore.Type;
export default AuthStore;
