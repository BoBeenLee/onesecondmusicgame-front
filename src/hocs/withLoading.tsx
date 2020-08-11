import hoistNonReactStatic from "hoist-non-react-statics";
import React, { Component } from "react";
import styled from "styled-components/native";

import Loading from "src/components/loading/Loading";

interface IStates {
  isLoading: boolean;
}

export interface ILoadingProps {
  wrapperLoading?: (func: any) => any;
  isLoading?: boolean;
}

const OverlayView = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: #000;
  opacity: 0.3;
  z-index: 99;
`;

const LoadingView = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  z-index: 99;
`;

const withLoading = (LoadingComponent: any = Loading) => <P extends object>(
  TargetComponent: React.ComponentType<P>
): any => {
  class WithLoading extends Component<Subtract<P, ILoadingProps>, IStates> {
    public state = {
      isLoading: false
    };

    public render() {
      const { isLoading } = this.state;
      return (
        <React.Fragment>
          <TargetComponent
            {...(this.props as P)}
            wrapperLoading={this.wrapperLoading}
            isLoading={isLoading}
          />
          {this.isLoadingShow() && (
            <React.Fragment>
              <OverlayView />
              <LoadingView>
                <LoadingComponent />
              </LoadingView>
            </React.Fragment>
          )}
        </React.Fragment>
      );
    }

    private wrapperLoading = (func: any) => {
      return async (...args: any[]) => {
        this.setState({
          isLoading: true
        });
        try {
          return await func(...args);
        } finally {
          this.setState({
            isLoading: false
          });
        }
      };
    };

    private isLoadingShow = () => {
      const { isLoading } = this.state;
      return isLoading;
    };
  }
  hoistNonReactStatic(WithLoading, TargetComponent);
  return WithLoading;
};

export default withLoading;
