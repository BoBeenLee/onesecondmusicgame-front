import hoistNonReactStatics from "hoist-non-react-statics";
import React from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

export enum ScrollDirection {
  IDLE = "IDLE",
  UPWARD = "UPWARD",
  DOWNWARD = "DOWNWARD"
}

export interface IScrollDirectionProps {
  scrollDirectionProps: {
    scrollDirection: ScrollDirection;
    onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  };
}

interface IState {
  scrollDirection: ScrollDirection;
}

const withScrollDirection = ({ sensitivity = 5 }: { sensitivity: number }) => <
  T extends IScrollDirectionProps
>(
  Component: React.ComponentType<T>
): any => {
  class WithScrollDirection extends React.Component<T, IState> {
    public scrollY = 0;
    public state = {
      scrollDirection: ScrollDirection.IDLE
    };

    public render() {
      return (
        <Component
          {...this.props}
          scrollDirectionProps={this.scrollDirectionProps}
        />
      );
    }

    private get scrollDirectionProps() {
      return {
        onScroll: this.onScroll,
        scrollDirection: this.state.scrollDirection
      };
    }

    private onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const prevScrollY = this.scrollY;
      const currentScrollY = event.nativeEvent.contentOffset.y;
      const scrollDirection =
        currentScrollY > prevScrollY
          ? ScrollDirection.DOWNWARD
          : currentScrollY < prevScrollY
          ? ScrollDirection.UPWARD
          : ScrollDirection.IDLE;

      if (scrollDirection === ScrollDirection.IDLE) {
        this.setState({ scrollDirection });
        return;
      }

      if (this.state.scrollDirection !== scrollDirection) {
        const diff = Math.abs(currentScrollY - prevScrollY);

        if (diff > sensitivity) {
          this.setState({ scrollDirection });
        }
      }

      this.scrollY = currentScrollY;
    };
  }

  hoistNonReactStatics(WithScrollDirection, Component);
  return WithScrollDirection;
};

export default withScrollDirection;
