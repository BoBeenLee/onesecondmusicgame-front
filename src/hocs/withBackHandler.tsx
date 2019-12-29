import hoistNonReactStatics from "hoist-non-react-statics";
import React from "react";
import { BackHandler, NativeEventSubscription } from "react-native";

export interface IBackHandlerProps {
  addBackButtonListener: (callback: () => boolean) => void;
}

const withBackHandler = <T extends IBackHandlerProps, P>(
  Component: React.ComponentType<T> & P
) => {
  class WithBackHandler extends React.Component<
    Subtract<T, IBackHandlerProps> & { innerRef: any }
  > {
    public backHandler: NativeEventSubscription | null = null;

    public componentWillUnmount() {
      if (this.backHandler) {
        this.backHandler.remove();
      }
    }

    public render() {
      const { innerRef, ...props } = this.props;
      return (
        <Component
          {...(props as any)}
          ref={innerRef}
          addBackButtonListener={this.addBackButtonListener}
        />
      );
    }

    public addBackButtonListener = (callback: () => boolean) => {
      this.backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        callback
      );
    };
  }

  const WithBackHandlerFowardRef = React.forwardRef(
    (props: Subtract<T, IBackHandlerProps>, ref: any) => {
      return <WithBackHandler innerRef={ref} {...props} />;
    }
  );

  return hoistNonReactStatics(WithBackHandlerFowardRef, Component);
};

export default withBackHandler;
