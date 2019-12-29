import { types } from "mobx-state-tree";
import { AppState, AppStateStatus } from "react-native";

import TodoStore from "src/stores/TodoStore";
import AuthStore from "src/stores/AuthStore";
import ToastStore from "src/stores/ToastStore";
import PushNotificationStore from "src/stores/PushNotificationStore";
import CodePushStore from "src/stores/CodePushStore";

const Store = types
  .model({
    appStateStatus: types.frozen<AppStateStatus>(AppState.currentState),
    authStore: types.optional(AuthStore, {}),
    codePushStore: types.optional(CodePushStore, {}),
    todoStore: types.optional(TodoStore, {}),
    toastStore: types.optional(ToastStore, {}),
    pushNotificationStore: types.optional(PushNotificationStore, {})
  })
  .actions(self => {
    const setAppStateStatus = (appState: AppStateStatus) => {
      self.appStateStatus = appState;
    };

    return {
      setAppStateStatus
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
