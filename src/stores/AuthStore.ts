import _ from "lodash";
import KakaoLogin from "@react-native-seoul/kakao-login";
import { flow, getRoot, Instance, types } from "mobx-state-tree";
import firebase from "react-native-firebase";

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
      } catch (error) {
        rootStore.toastStore.showToast(error.message);
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
