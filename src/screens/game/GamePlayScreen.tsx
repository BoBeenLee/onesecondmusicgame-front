import React, { Component } from "react";
import styled from "styled-components/native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold14 } from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { push, pop } from "src/utils/navigator";
import CircleCheckGroup from "src/components/icon/CircleCheckGroup";
import LimitTimeProgress from "src/components/progress/LimitTimeProgress";
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

const Header = styled.View`
  justify-content: center;
  align-items: center;
  padding-top: 16px;
  padding-horizontal: 16px;
`;

const Lifes = styled(CircleCheckGroup)`
  margin-bottom: 21px;
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
        <Header>
          <Lifes circles={["active", "inactive", "check"]} />
          <LimitTimeProgress seconds={60} onTimeEnd={this.onLimitTimeEnd} />
        </Header>
        <Content>
          <Logo>GamePlay</Logo>
        </Content>
      </Container>
    );
  }

  private onLimitTimeEnd = () => {
    // NOTHING
  };

  private back = () => {
    const { componentId } = this.props;
    pop(componentId);
  };
}

export default GamePlayScreen;
