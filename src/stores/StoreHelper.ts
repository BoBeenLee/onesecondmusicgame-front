import { getRoot } from "mobx-state-tree";

import { AppStateStatus } from "react-native";
import { IAuthStore } from "src/stores/AuthStore";
import { IToastStore } from "src/stores/ToastStore";

export interface IStoreType {
  appStateStatus: AppStateStatus;
  authStore: IAuthStore;
  toastStore: IToastStore;
}

export interface IStores {
  store: IStoreType;
}

export const getRootStore = (self: any): IStoreType => getRoot<any>(self);
