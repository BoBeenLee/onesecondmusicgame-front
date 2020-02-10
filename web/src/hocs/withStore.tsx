import { Provider } from "mobx-react";
import React, { Component } from "react";

const withStore = (store: any) => (element: any): any => {
  return <Provider store={store}>{element}</Provider>;
};

export default withStore;
