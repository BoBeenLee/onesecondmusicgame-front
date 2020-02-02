import React, { Component } from "react";
import styled from "styled-components/native";

import { SCREEN_IDS } from "src/screens/constant";
import { dismissOverlay, showOverlayTransparent } from "src/utils/navigator";
import { defaultItemToBoolean, FIELD, setItem } from "src/utils/storage";
import { Bold12, Bold18 } from "src/components/text/Typographies";
import colors from "src/styles/colors";
import SkipIcon from "src/components/icon/SkipIcon";
import _ from "lodash";

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

const Text = styled(Bold12)``;

const PlayStep1 = styled.View`
  position: absolute;
  flex-direction: column;
  justify-content: flex-end;
  bottom: 200px;
  right: 18px;
`;

const SkipDescription = styled.Text`
  color: ${colors.white};
`;

const SkipButton = styled.TouchableOpacity`
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
        <SkipButton onPress={_.identity}>
          <SkipIcon />
          <SkipButtonText>SKIP</SkipButtonText>
          <SkipBadge>
            <SkipBadgeText>5</SkipBadgeText>
          </SkipBadge>
        </SkipButton>
      </PlayStep1>,
      <Text key="2">Hello World2</Text>
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
