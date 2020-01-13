import _ from "lodash";
import React from "react";
import { mst } from "reactotron-mst";
import Reactotron, { trackGlobalErrors } from "reactotron-react-js";

import { IStore } from "src/stores/Store";

let overlay = _.identity;
export const setupReactotron = (store: IStore) => {
  Reactotron
    .configure({
      name: "web"
    })
    .use(trackGlobalErrors({}))
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