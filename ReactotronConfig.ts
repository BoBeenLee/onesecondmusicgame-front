import AsyncStorage from "@react-native-community/async-storage";
import _ from "lodash";
import React from "react";
import { mst } from "reactotron-mst";
import Reactotron, {
  asyncStorage,
  openInEditor,
  networking,
  trackGlobalErrors
} from "reactotron-react-native";

import { IStore } from "./src/stores/Store";

export const isReactotron = () => {
  return __DEV__;
};

let overlay = _.identity;
export const setupReactotron = (store: IStore) => {
  Reactotron.configure({
    name: "app"
  })
    .use(asyncStorage({}))
    .use(networking({}))
    .use(trackGlobalErrors({}))
    .use(openInEditor())
    .use(mst())
    .useReactNative()
    .connect();
  (Reactotron as any).trackMstNode(store);
  overlay = (Reactotron as any).overlay;
  (console as any).tron = Reactotron;

  Reactotron.onCustomCommand({
    command: "clearAllAsyncStorage",
    description: "clearAllAsyncStorage",
    handler: async () => {
      await AsyncStorage.clear();
    },
    title: "clearAllAsyncStorage"
  });
};

export const withOverlay: any = (App: React.ReactNode) => {
  return overlay(App);
};

const reactotronLog = (args: any) => {
  (Reactotron as any).log(args);
};
