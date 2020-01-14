import hoistNonReactStatic from "hoist-non-react-statics";
import React, { Component } from "react";
import { Navigation } from "react-native-navigation";

import { setCurrentComponent } from "src/utils/navigator";
import { setCurrentScreen } from "src/configs/analytics";

interface IProps {
  componentId: string;
}

const withNavigator = <P extends object>(
  TargetComponent: React.ComponentType<P>
): any => {
  class WithNavigator extends Component<P & IProps> {
    constructor(props: P & IProps) {
      super(props);
      Navigation.events().bindComponent(this);
    }

    public componentDidAppear({ componentName }: { componentName: string }) {
      const { componentId } = this.props;
      setCurrentScreen(componentName);
      setCurrentComponent(componentId, componentName);
    }

    public render() {
      return <TargetComponent {...this.props} />;
    }
  }
  hoistNonReactStatic(WithNavigator, TargetComponent as any);
  return WithNavigator;
};

export default withNavigator;
