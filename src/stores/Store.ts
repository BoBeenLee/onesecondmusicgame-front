import { flow, types } from "mobx-state-tree";
import { AppState, AppStateStatus } from "react-native";
import TrackPlayer from "react-native-track-player";

import AppStore from "src/stores/AppStore";
import AuthStore from "src/stores/AuthStore";
import ToastStore from "src/stores/ToastStore";
import SingerStore from "src/stores/SingerStore";
import PushNotificationStore from "src/stores/PushNotificationStore";
import CodePushStore from "src/stores/CodePushStore";
import LinkingStore from "src/stores/LinkingStore";
import { initialize as initializeRequestAPI } from "src/configs/requestAPI";
import { initialize as initializeRemoteConfig } from "src/configs/remoteConfig";
import { initialize as initializeAdmob } from "src/configs/admob";
import { initialize as initializeAnalytics } from "src/configs/analytics";
import { getOS } from "src/utils/device";
import { getVersion } from "src/configs/device";

const Store = types
  .model({
    appStateStatus: types.frozen<AppStateStatus>(AppState.currentState),
    appStore: types.optional(AppStore, {
      os: getOS(),
      version: getVersion()
    }),
    authStore: types.optional(AuthStore, {}),
    codePushStore: types.optional(CodePushStore, {}),
    singerStore: types.optional(SingerStore, {}),
    toastStore: types.optional(ToastStore, {}),
    pushNotificationStore: types.optional(PushNotificationStore, {}),
    linkingStore: types.optional(LinkingStore, {})
  })
  .actions(self => {
    const setAppStateStatus = (appState: AppStateStatus) => {
      self.appStateStatus = appState;
    };

    const initializeApp = flow(function*() {
      yield Promise.all([
        self.appStore.fetchIsNeedForceUpdate(),
        TrackPlayer.setupPlayer(),
        self.codePushStore.notifyAppReady(),
        initializeRemoteConfig()
      ]);
      initializeAnalytics();
      initializeAdmob();
      self.linkingStore.initialize();
      self.pushNotificationStore.initialize();
      yield Promise.all([
        self.codePushStore.initialize(),
        self.authStore.initialize()
      ]);
      initializeRequestAPI();
    });

    const initializeMainApp = flow(function*() {
      yield Promise.all([
        self.singerStore.initializeSingers(),
        self.authStore.user?.heart?.fetchHeart(),
        self.authStore.user?.advertise?.fetchKeywords(),
        self.authStore.user?.advertise?.fetchImages()
      ]);
    });

    return {
      setAppStateStatus,
      initializeApp,
      initializeMainApp
    };
  });

export type IStore = typeof Store.Type;

let store: IStore | null = null;
const getRootStore = (): IStore => {
  if (store === null) {
    store = Store.create({
      appStateStatus: AppState.currentState
    });
  }
  return store;
};

export default Store;
export { getRootStore };
