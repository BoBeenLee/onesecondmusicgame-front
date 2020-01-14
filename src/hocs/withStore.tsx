import hoistNonReactStatic from "hoist-non-react-statics";
import { Provider } from "mobx-react/native";
import React, { Component } from "react";

import { IStore } from "src/stores/Store";

const withStore = (store: IStore) => <P extends object>(
  TargetComponent: React.ComponentType<P>
): any => {
  class WithStore extends Component<P> {
    public render() {
      return (
        <Provider store={store}>
          <TargetComponent {...this.props} />
        </Provider>
      );
    }
  }
  hoistNonReactStatic(WithStore, TargetComponent);
  return WithStore;
};

export default withStore;
