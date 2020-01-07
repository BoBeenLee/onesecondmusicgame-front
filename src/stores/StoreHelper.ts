import { getRoot } from "mobx-state-tree";

import { AppStateStatus } from "react-native";
import { IAuthStore } from "src/stores/AuthStore";
import { IToastStore } from "src/stores/ToastStore";
import { IPushNotificationStore } from "src/stores/PushNotificationStore";
import { ILinkingStore } from "src/stores/LinkingStore";
import { ICodePushStore } from "src/stores/CodePushStore";

export interface IStoreType {
  appStateStatus: AppStateStatus;
  authStore: IAuthStore;
  codePushStore: ICodePushStore;
  toastStore: IToastStore;
  pushNotificationStore: IPushNotificationStore;
  linkingStore: ILinkingStore;
}

export interface IStores {
  store: IStoreType;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRootStore = (self: any): IStoreType => getRoot<any>(self);
