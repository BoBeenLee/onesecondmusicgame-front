import React, { Component } from "react";
import styled from "styled-components/native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold14 } from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { push, pop } from "src/utils/navigator";
import { TOP_BAR_HEIGHT } from "src/components/topbar/OSMGTopBar";
import colors from "src/styles/colors";
import RegisterSongScreen from "src/screens/RegisterSongScreen";

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
  height: ${TOP_BAR_HEIGHT}px;
  justify-content: center;
  align-items: center;
`;

const Title = styled(Bold12)``;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const GameModeSection = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const GameModeTitle = styled(Bold12)``;

const Footer = styled.View`
  height: 100px;
  justify-content: center;
  align-items: center;
`;

const RegisterSongButton = styled.TouchableOpacity``;

const RegisterSongButtonText = styled(Bold12)``;

class GameModeScreen extends Component<IProps> {
  public static open(params: IParams) {
    return push({
      componentId: params.componentId,
      nextComponentId: SCREEN_IDS.GameModeScreen
    });
  }

  public render() {
    return (
      <Container>
        <Header>
          <Title>게임 모드 선택</Title>
        </Header>
        <Content>
          <GameModeSection>
            <GameModeTitle>가수별</GameModeTitle>
          </GameModeSection>
          <GameModeSection>
            <GameModeTitle>시대별</GameModeTitle>
          </GameModeSection>
        </Content>
        <Footer>
          <RegisterSongButton onPress={RegisterSongScreen.open}>
            <RegisterSongButtonText>음원 등록하기</RegisterSongButtonText>
          </RegisterSongButton>
        </Footer>
      </Container>
    );
  }

  private back = () => {
    const { componentId } = this.props;
    pop(componentId);
  };
}

export default GameModeScreen;
