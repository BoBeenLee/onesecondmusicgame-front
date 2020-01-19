import hoistNonReactStatics from "hoist-non-react-statics";
import React from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

import { ScrollDirection, getScrollDirection } from "src/utils/scrollView";
import _ from "lodash";

export interface IScrollDirectionProps {
  scrollDirectionProps: {
    onScroll: (
      callback: (scrollDirection: ScrollDirection) => void
    ) => (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
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
        onScroll: this.onScroll
      };
    }

    private onScroll = (
      callback: (scrollDirection: ScrollDirection) => void
    ) => (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollDirection = getScrollDirection(event, {
        scrollY: this.scrollY,
        currentScrollDirection: this.state.scrollDirection,
        sensitivity
      });
      if (scrollDirection !== null) {
        this.setState(
          { scrollDirection },
          _.partial(callback, scrollDirection)
        );
      }
      const currentScrollY = event.nativeEvent.contentOffset.y;
      this.scrollY = currentScrollY;
    };
  }

  hoistNonReactStatics(WithScrollDirection, Component);
  return WithScrollDirection;
};

export default withScrollDirection;
