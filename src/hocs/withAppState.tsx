import hoistNonReactStatic from "hoist-non-react-statics";
import React, { Component } from "react";
import { AppState, AppStateStatus } from "react-native";

import { getRootStore } from "src/stores/Store";

const withAppState = <P extends object>(
  TargetComponent: React.ComponentType<P>
): any => {
  const WithAppState = class WithAppStateAnonymous extends Component<P> {
    public componentDidMount() {
      AppState.addEventListener("change", this.handleAppStateChange);
    }

    public componentWillUnmount() {
      AppState.removeEventListener("change", this.handleAppStateChange);
    }

    public render() {
      return <TargetComponent {...this.props} />;
    }

    private handleAppStateChange = async (appState: AppStateStatus) => {
      if (appState !== getRootStore().appStateStatus) {
        getRootStore().setAppStateStatus(appState);
      }
    };

    private isChangeActiveState = (appState: AppStateStatus) => {
      return (
        appState === "active" && getRootStore().appStateStatus !== "active"
      );
    };
  };
  hoistNonReactStatic(WithAppState, TargetComponent as any);
  return WithAppState;
};

export default withAppState;
