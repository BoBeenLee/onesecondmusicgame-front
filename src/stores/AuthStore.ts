import _ from "lodash";
import KakaoLogin from "@react-native-seoul/kakao-login";
import { flow, getRoot, Instance, types } from "mobx-state-tree";
import {
  GoogleSignin,
  statusCodes
} from "@react-native-community/google-signin";

import { getRootStore } from "src/stores/StoreHelper";
export type AUTH_PROVIDER = "KAKAO" | "GOOGLE" | "EMAIL" | "NONE";

const AuthStore = types
  .model("AuthStore", {
    provider: types.frozen<AUTH_PROVIDER>("NONE"),
    accessId: types.optional(types.string, ""),
    accessToken: types.optional(types.string, ""),
    refreshToken: types.optional(types.string, "")
  })
  .actions(self => {
    const rootStore = getRootStore(self);

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
        yield GoogleSignin.hasPlayServices();
        const userInfo: RetrieveAsyncFunc<typeof GoogleSignin.signIn> = yield GoogleSignin.signIn();

        self.accessId = userInfo.user.id;
        self.accessToken = userInfo.idToken || "";
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

    const emailSignIn = () => {};

    const signOut = () => {};

    return {
      kakaoSignIn,
      googleSignIn,
      emailSignIn,
      signOut
    };
  });

export type IAuthStore = typeof AuthStore.Type;
export default AuthStore;
