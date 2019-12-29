import hoistNonReactStatic from "hoist-non-react-statics";
import _ from "lodash";
import React, { Component } from "react";
import styled from "styled-components/native";

import withBackHandler, { IBackHandlerProps } from "src/hocs/withBackHandler";

interface IStates {
  PopupComponent: JSX.Element | null;
  closeOverlay: boolean;
  closeCallback: () => void;
}

export interface IPopupProps {
  showPopup: (
    PopupComponent: JSX.Element | null,
    closeOverlay?: boolean
  ) => void;
  setClosePopupCallback: (closeCallback: () => void) => void;
}

const Container = styled.View`
  width: 100%;
  flex: 1;
`;

const PopupContainer = styled.View`
  position: absolute;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 99;
`;

const PopupTouchableOverlay = styled.TouchableOpacity.attrs({
  activeOpacity: 1
})`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const withPopup = <P extends IPopupProps>(
  TargetComponent: React.ComponentType<P>
): any => {
  const WithPopup = class WithPopupAnonymous extends Component<
    Subtract<P, IPopupProps>,
    IStates
  > {
    constructor(props: Subtract<P, IPopupProps>) {
      super(props);

      this.state = {
        PopupComponent: null,
        closeCallback: _.identity,
        closeOverlay: true
      };
    }

    public render() {
      const Popup = this.Popup;
      return (
        <Container>
          <TargetComponent
            {...(this.props as P)}
            showPopup={this.showPopup}
            setClosePopupCallback={this.setCloseCallback}
          />
          {this.isShow ? <Popup /> : null}
        </Container>
      );
    }

    private showPopup = (
      PopupComponent: JSX.Element | null,
      closeOverlay = true
    ) => {
      this.setState({
        PopupComponent,
        closeOverlay
      });
    };

    private setCloseCallback = (closeCallback: () => void) => {
      this.setState({
        closeCallback
      });
    };

    private onBackgroundPress = () => {
      this.setState(
        {
          PopupComponent: null
        },
        () => {
          const { closeCallback } = this.state;
          if (closeCallback) {
            closeCallback();
          }
        }
      );
      return true;
    };

    private get isShow() {
      const { PopupComponent } = this.state;
      return !_.isEmpty(PopupComponent);
    }

    private get Popup() {
      const { closeOverlay } = this.state;
      if (!closeOverlay) {
        return () => (
          <PopupContainer>
            <PopupTouchableOverlay />
            {this.state.PopupComponent}
          </PopupContainer>
        );
      }
      return withBackHandler(
        (props: React.PropsWithChildren<IBackHandlerProps>) => {
          const { addBackButtonListener } = props;
          if (addBackButtonListener) {
            addBackButtonListener(this.onBackgroundPress);
          }
          return (
            <PopupContainer>
              <PopupTouchableOverlay onPress={this.onBackgroundPress} />
              {this.state.PopupComponent}
            </PopupContainer>
          );
        }
      );
    }
  };

  return hoistNonReactStatic(WithPopup, TargetComponent);
};

export default withPopup;
