import hoistNonReactStatic from "hoist-non-react-statics";
import _ from "lodash";
import React, { Component } from "react";
import styled from "styled-components/native";

import withBackHandler, { IBackHandlerProps } from "src/hocs/withBackHandler";
import TouchablePopup from "src/components/popup/TouchablePopup";

interface IStates {
  PopupComponent: JSX.Element | null;
  closeOverlay: boolean;
  closeCallback: () => void;
}

export interface IPopupProps {
  popupProps: {
    showPopup: (
      PopupComponent: JSX.Element | null,
      closeOverlay?: boolean,
      closeCallback?: () => void
    ) => void;
    closePopup: () => void;
  };
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

const INITIAL_STATES = {
  PopupComponent: null,
  closeCallback: _.identity,
  closeOverlay: true
};

const withPopup = <P extends IPopupProps>(
  TargetComponent: React.ComponentType<P>
) => {
  const WithPopup = class WithPopupAnonymous extends Component<
    Subtract<P, IPopupProps>,
    IStates
  > {
    constructor(props: Subtract<P, IPopupProps>) {
      super(props);

      this.state = INITIAL_STATES;
    }

    public render() {
      return (
        <Container>
          <TargetComponent
            {...(this.props as P)}
            popupProps={{
              showPopup: this.showPopup,
              closePopup: this.closePopup
            }}
          />
          {this.isShow ? this.Popup : null}
        </Container>
      );
    }

    private showPopup = (
      PopupComponent: JSX.Element | null,
      closeOverlay = true,
      closeCallback = _.identity
    ) => {
      this.setState({
        PopupComponent,
        closeOverlay,
        closeCallback
      });
    };

    private closePopup = () => {
      this.setState(INITIAL_STATES, this.state?.closeCallback);
    };

    private onBackgroundPress = () => {
      const { closeOverlay } = this.state;
      if (!closeOverlay) {
        return true;
      }
      this.closePopup();
      return true;
    };

    private get isShow() {
      const { PopupComponent } = this.state;
      return !_.isEmpty(PopupComponent);
    }

    private get Popup() {
      const { PopupComponent } = this.state;
      return (
        <TouchablePopup
          PopupComponent={PopupComponent}
          onBackgroundPress={this.onBackgroundPress}
        />
      );
    }
  };

  return hoistNonReactStatic(WithPopup, TargetComponent);
};

export default withPopup;
