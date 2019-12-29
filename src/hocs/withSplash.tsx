import hoistNonReactStatic from "hoist-non-react-statics";
import React, { Component } from "react";
import SplashScreen from "react-native-splash-screen";

const withSplash = <P extends object>(
  TargetComponent: React.ComponentType<P>
): any => {
  class WithSplash extends Component<P> {
    public componentDidMount() {
      SplashScreen.hide();
    }

    public render() {
      return <TargetComponent {...this.props} />;
    }
  }
  hoistNonReactStatic(WithSplash, TargetComponent as any);
  return WithSplash;
};

export default withSplash;
