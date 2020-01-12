import React, { Component } from "react";
import styled from "styled-components/native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold14 } from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { push, pop } from "src/utils/navigator";
import ModalTopBar from "src/components/topbar/ModalTopBar";
import colors from "src/styles/colors";

interface IParams {
  componentId: string;
}

interface IProps {
  componentId: string;
}

const Container = styled(ContainerWithStatusBar)`
  flex: 1;
  flex-direction: column;
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Logo = styled(Bold14)``;

class GamePlayScreen extends Component<IProps> {
  public static open(params: IParams) {
    return push({
      componentId: params.componentId,
      nextComponentId: SCREEN_IDS.GamePlayScreen
    });
  }

  public render() {
    return (
      <Container>
        <ModalTopBar title="" onBackPress={this.back} />
        <Content>
          <Logo>GamePlay</Logo>
        </Content>
      </Container>
    );
  }

  private back = () => {
    const { componentId } = this.props;
    pop(componentId);
  };
}

export default GamePlayScreen;
