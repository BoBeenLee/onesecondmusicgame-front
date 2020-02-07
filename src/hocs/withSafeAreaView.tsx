import hoistNonReactStatic from "hoist-non-react-statics";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { Component } from "react";

const withSafeAreaView = <P extends object>(
  TargetComponent: React.ComponentType<P>
) => {
  class WithSafeAreaView extends Component<P> {
    public render() {
      return (
        <SafeAreaProvider>
          <TargetComponent {...this.props} />
        </SafeAreaProvider>
      );
    }
  }
  hoistNonReactStatic(WithSafeAreaView, TargetComponent);
  return WithSafeAreaView;
};

export default withSafeAreaView;
