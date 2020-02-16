import _ from "lodash";
import React, { Component } from "react";
import styled from "styled-components/native";

import { SCREEN_IDS } from "src/screens/constant";
import { dismissOverlay, showOverlayTransparent } from "src/utils/navigator";
import { Bold30, Bold55 } from "src/components/text/Typographies";
import colors from "src/styles/colors";
import { iosStatusBarHeight } from "src/utils/device";

interface IParams {
  onAfterClose?: () => void;
}

interface IProps extends IParams {
  componentId: string;
}

interface IStates {
  step: number;
}

const Container = styled.View`
  flex: 1;
  background-color: rgba(33, 33, 33, 0.8);
`;

const PlayStep = styled.View`
  position: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  top: ${iosStatusBarHeight(true) + 213}px;
  padding-horizontal: 16px;
`;

const TitleView = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled(Bold30)`
  color: ${colors.robinEggBlue};
`;

const BigTitle = styled(Bold55)`
  color: ${colors.robinEggBlue};
`;

class GameReadyPlayOverlay extends Component<IProps, IStates> {
  public static async open(params: IParams) {
    await showOverlayTransparent(SCREEN_IDS.GameReadyPlayOverlay, params);
  }

  public GamePlaySteps: React.ReactNode[];
  public intervalId: any;

  constructor(props: IProps) {
    super(props);

    this.state = { step: 0 };
    this.GamePlaySteps = [
      <PlayStep key={"1"}>
        <TitleView>
          <Title>게임</Title>
          <BigTitle>준비</BigTitle>
        </TitleView>
      </PlayStep>,
      <PlayStep key="2">
        <TitleView>
          <Title>게임</Title>
          <BigTitle>시작</BigTitle>
        </TitleView>
      </PlayStep>
    ];

    this.intervalId = setInterval(() => {
      const { step } = this.state;
      if (step >= this.GamePlaySteps.length - 1) {
        this.back();
        this.intervalId && clearInterval(this.intervalId);
        return;
      }
      this.setState({
        step: step + 1
      });
    }, 1000);
  }

  public render() {
    const { step } = this.state;
    return <Container>{this.GamePlaySteps[step]}</Container>;
  }

  private back = () => {
    const { componentId, onAfterClose } = this.props;
    dismissOverlay(componentId);
    onAfterClose?.();
  };
}

export default GameReadyPlayOverlay;
