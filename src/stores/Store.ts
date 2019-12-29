import { types } from "mobx-state-tree";
import { AppState, AppStateStatus } from "react-native";

import TodoStore from "src/stores/TodoStore";
import AuthStore from "src/stores/AuthStore";
import ToastStore from "src/stores/ToastStore";

const Store = types
  .model({
    appStateStatus: types.frozen<AppStateStatus>(AppState.currentState),
    authStore: types.optional(AuthStore, {}),
    todoStore: types.optional(TodoStore, {}),
    toastStore: types.optional(ToastStore, {})
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
