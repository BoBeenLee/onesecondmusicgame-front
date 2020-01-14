import hoistNonReactStatics from "hoist-non-react-statics";
import React from "react";
import { BackHandler, NativeEventSubscription } from "react-native";

export interface IBackHandlerProps {
  backHandlerProps: {
    addBackButtonListener: (callback: () => boolean) => void;
  };
}

const withBackHandler = <P extends IBackHandlerProps>(
  TargetComponent: React.ComponentType<P>
) => {
  class WithBackHandler extends React.Component<
    Subtract<P, IBackHandlerProps>
  > {
    public backHandler: NativeEventSubscription | null = null;

    public componentWillUnmount() {
      this.backHandler?.remove();
    }

    public render() {
      return (
        <TargetComponent
          {...(this.props as P)}
          backHandlerProps={this.backHandlerProps}
        />
      );
    }

    public get backHandlerProps() {
      return {
        addBackButtonListener: this.addBackButtonListener
      };
    }

    public addBackButtonListener = (callback: () => boolean) => {
      this.backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        callback
      );
    };
  }
  return hoistNonReactStatics(WithBackHandler, TargetComponent);
};

export default withBackHandler;
