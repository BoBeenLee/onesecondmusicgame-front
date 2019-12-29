import AsyncStorage from "@react-native-community/async-storage";
import _ from "lodash";
import React from "react";
import { mst } from "reactotron-mst";
import Reactotron, { trackGlobalErrors } from "reactotron-react-native";

import { IStore } from "./src/stores/Store";

export const isReactotron = () => {
  return __DEV__;
};

let overlay = _.identity;
export const setupReactotron = (store: IStore) => {
  Reactotron.setAsyncStorageHandler(AsyncStorage)
    .configure({
      name: "app"
    })
    .use(trackGlobalErrors({}))
    .useReactNative()
    .use(mst())
    .connect();
  (Reactotron as any).trackMstNode(store);
  overlay = (Reactotron as any).overlay;
  (console as any).tron = Reactotron;
};

export const withOverlay: any = (App: React.ReactNode) => {
  return overlay(App);
};

const reactotronLog = (args: any) => {
  (Reactotron as any).log(args);
};