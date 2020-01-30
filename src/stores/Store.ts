import { flow, types } from "mobx-state-tree";
import { AppState, AppStateStatus } from "react-native";

import AuthStore from "src/stores/AuthStore";
import ToastStore from "src/stores/ToastStore";
import SingerStore from "src/stores/SingerStore";
import PushNotificationStore from "src/stores/PushNotificationStore";
import CodePushStore from "src/stores/CodePushStore";
import LinkingStore from "src/stores/LinkingStore";
import { initialize as initializeRequestAPI } from "src/configs/requestAPI";
import { initialize as initializeSoundCloudAPI } from "src/configs/soundCloudAPI";
import { initialize as initializeRemoteConfig } from "src/configs/remoteConfig";
import { initialize as initializeAdmob } from "src/configs/admob";
import { initialize as initializeAnalytics } from "src/configs/analytics";

const Store = types
  .model({
    appStateStatus: types.frozen<AppStateStatus>(AppState.currentState),
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
        self.codePushStore.notifyAppReady(),
        initializeRemoteConfig()
      ]);
      initializeAnalytics();
      initializeAdmob();
      self.linkingStore.initialize();
      self.pushNotificationStore.initialize();
      yield Promise.all([
        self.codePushStore.initialize(),
        self.authStore.initialize(),
        initializeSoundCloudAPI()
      ]);
      initializeRequestAPI();
    });

    const initializeMainApp = () => {
      self.singerStore.initialize();
    };

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
