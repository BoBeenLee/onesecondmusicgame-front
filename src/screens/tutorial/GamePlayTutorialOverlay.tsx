import _ from "lodash";
import React, { Component } from "react";
import styled, { css } from "styled-components/native";

import { SCREEN_IDS } from "src/screens/constant";
import { dismissOverlay, showOverlayTransparent } from "src/utils/navigator";
import { defaultItemToBoolean, FIELD, setItem } from "src/utils/storage";
import { Bold12, Bold18, Bold20 } from "src/components/text/Typographies";
import colors from "src/styles/colors";
import SkipIcon from "src/components/icon/SkipIcon";
import LimitTimeProgress from "src/components/progress/LimitTimeProgress";
import { iosStatusBarHeight } from "src/utils/device";
import images from "src/images";

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

const ContainerTouchabledView = styled.TouchableWithoutFeedback`
  flex: 1;
  background-color: rgba(33, 33, 33, 0.8);
`;

const PlayStep1 = styled.View`
  position: absolute;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  bottom: 15px;
  left: 15px;
`;

const SkipDescription = styled(Bold20)`
  color: ${colors.white};
  margin-bottom: 32px;
`;

const SkipButton = styled.View`
  width: 56px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SkipButtonText = styled(Bold12)`
  color: ${colors.pinkyPurpleThree};
  margin-top: 2px;
`;

const SkipBadge = styled.View`
  position: absolute;
  top: -5px;
  right: -5px;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 11px;
  background-color: ${colors.pinkyPurple};
`;

const SkipBadgeText = styled(Bold18)`
  color: ${colors.paleLavender};
`;

const PlayStep2 = styled.View`
  position: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  top: ${iosStatusBarHeight(true) + 180}px;
  padding-horizontal: 16px;
`;

const PlayStep2Description = styled(Bold20)`
  letter-spacing: -0.5px;
  text-align: center;
  color: ${colors.white};
`;

const PlayIcon = styled.Image<{ size: number }>`
  ${({ size }) => css`
    width: ${size}px;
    height: ${size}px;
  `}
  margin-bottom: 24px;
`;

const PlayStep3 = styled.View`
  position: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  top: ${iosStatusBarHeight(true) + 70}px;
  padding-horizontal: 16px;
`;

const PlayStep3TimeProgress = styled(LimitTimeProgress)`
  margin-bottom: 20px;
`;

const PlayStep3Title = styled(Bold20)`
  color: ${colors.white};
`;

const PlayStep3HighlightTitle = styled(Bold20)`
  color: ${colors.lightMagentaThree};
`;

class GamePlayTutorialOverlay extends Component<IProps, IStates> {
  public static async open(params: IParams) {
    if (await defaultItemToBoolean(FIELD.DO_NOT_SHOW_GAME_PLAY, false)) {
      params.onAfterClose?.();
      return;
    }
    await showOverlayTransparent(SCREEN_IDS.GamePlayTutorialOverlay, params);
    await setItem(FIELD.DO_NOT_SHOW_GAME_PLAY, "true");
  }

  public GamePlaySteps: React.ReactNode[];

  constructor(props: IProps) {
    super(props);

    this.state = { step: 0 };
    this.GamePlaySteps = [
      <PlayStep1 key={"1"}>
        <SkipDescription>
          SKIP 아이템을 사용하면{"\n"}
          맞은 문제로 처리됩니다!
        </SkipDescription>
        <SkipButton>
          <SkipIcon />
          <SkipButtonText>SKIP</SkipButtonText>
          <SkipBadge>
            <SkipBadgeText>5</SkipBadgeText>
          </SkipBadge>
        </SkipButton>
      </PlayStep1>,
      <PlayStep2 key={"2"}>
        <PlayIcon size={65} source={images.playButton} />
        <PlayStep2Description>{`재생 버튼을 눌러서
1초 동안 노래를 들어보세요!`}</PlayStep2Description>
      </PlayStep2>,
      <PlayStep3 key="3">
        <PlayStep3TimeProgress key={`1`} totalSeconds={40} seconds={12} />
        <PlayStep3Title>
          제한 시간은 노래 1곡 당{" "}
          <PlayStep3HighlightTitle>40초</PlayStep3HighlightTitle>!{"\n"}
          <PlayStep3HighlightTitle>총 5곡</PlayStep3HighlightTitle>의 노래를
          맞춰주세요!
        </PlayStep3Title>
      </PlayStep3>
    ];
  }

  public render() {
    const { step } = this.state;
    return (
      <ContainerTouchabledView onPress={this.nextStep}>
        <Container>{this.GamePlaySteps[step]}</Container>
      </ContainerTouchabledView>
    );
  }

  private nextStep = () => {
    if (this.state.step === this.GamePlaySteps.length - 1) {
      this.back();
      return;
    }
    this.setState(prevState => ({ step: prevState.step + 1 }));
  };

  private back = () => {
    const { componentId, onAfterClose } = this.props;
    dismissOverlay(componentId);
    onAfterClose?.();
  };
}

export default GamePlayTutorialOverlay;
