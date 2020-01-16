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

const Container = styled.View`
  flex: 1;
  background-color: rgba(33, 33, 33, 0.8);
`;

const ContainerTouchabledView = styled.TouchableWithoutFeedback`
  flex: 1;
`;

const Text = styled(Bold12)``;

class GamePlayTutorialOverlay extends Component<IProps> {
  public static async open(params: IParams) {
    if (await defaultItemToBoolean(FIELD.DO_NOT_SHOW_GAME_PLAY, false)) {
      params.onAfterClose?.();
      return;
    }
    showOverlayTransparent(SCREEN_IDS.GamePlayTutorialOverlay, params);
    await setItem(FIELD.DO_NOT_SHOW_GAME_PLAY, "true");
  }

  public render() {
    return (
      <ContainerTouchabledView onPress={this.back}>
        <Container>
          <Text>Hello World</Text>
        </Container>
      </ContainerTouchabledView>
    );
  }

  private back = () => {
    const { componentId, onAfterClose } = this.props;
    dismissOverlay(componentId);
    onAfterClose?.();
  };
}

export default GamePlayTutorialOverlay;
