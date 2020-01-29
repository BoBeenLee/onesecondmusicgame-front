import React, { Component } from "react";
import styled from "styled-components/native";

import { SCREEN_IDS } from "src/screens/constant";
import { dismissOverlay, showOverlayTransparent } from "src/utils/navigator";
import { defaultItemToBoolean, FIELD, setItem } from "src/utils/storage";
import { Bold12 } from "src/components/text/Typographies";

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
      <Text key={"1"}>Hello World1</Text>,
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
