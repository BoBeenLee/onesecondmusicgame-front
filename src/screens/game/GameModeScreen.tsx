import React, { Component } from "react";
import styled from "styled-components/native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold18, Bold20 } from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { push, pop } from "src/utils/navigator";
import { TOP_BAR_HEIGHT } from "src/components/topbar/OSMGTopBar";
import colors from "src/styles/colors";
import RegisterSongScreen from "src/screens/song/RegisterSongScreen";
import LevelBadge from "src/components/badge/LevelBadge";
import GamePlayScreen from "src/screens/game/GamePlayScreen";
import MockButton from "src/components/button/MockButton";

interface IParams {
  componentId: string;
}

interface IProps {
  componentId: string;
}

const Container = styled(ContainerWithStatusBar)`
  flex: 1;
  flex-direction: column;
  padding-horizontal: 21px;
`;

const Header = styled.View`
  height: ${TOP_BAR_HEIGHT}px;
  justify-content: center;
  align-items: center;
`;

const Title = styled(Bold20)`
  padding-top: 35px;
  color: ${colors.black};
`;

const Content = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding-top: 78px;
`;

const GameModeSection = styled.TouchableOpacity`
  width: 100%;
  height: 105px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: solid 1px ${colors.warmGrey};
  margin-top: 35px;
`;

const GameModeTitle = styled(Bold18)``;

const GameModeDescription = styled(Bold12)``;

const LevelBadgeView = styled(LevelBadge)`
  position: absolute;
  top: -15px;
  left: 10px;
  background-color: ${colors.white};
`;

const Footer = styled.View`
  height: 100px;
  justify-content: center;
  align-items: center;
`;

const RegisterSongButton = styled(MockButton)``;

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
          <Title>난이도 선택</Title>
        </Header>
        <Content>
          <GameModeSection onPress={this.navigateToGamePlay}>
            <GameModeTitle>랜덤으로 시작하기</GameModeTitle>
            <GameModeDescription>
              무작위로 문제가 출제됩니다.
            </GameModeDescription>
            <LevelBadgeView level="HARD" />
          </GameModeSection>
          <GameModeSection onPress={this.navigateToSelectedSingersGamePlay}>
            <GameModeTitle>자신있는 가수 선택하기</GameModeTitle>
            <GameModeDescription>
              선택한 가수의 곡이 출제됩니다.
            </GameModeDescription>
          </GameModeSection>
        </Content>
      </Container>
    );
  }

  private navigateToRegisterSong = () => {
    const { componentId } = this.props;
    RegisterSongScreen.open({ componentId });
  };

  private navigateToGamePlay = () => {
    const { componentId } = this.props;

    GamePlayScreen.open({ componentId, heartCount: 0 });
  };

  private navigateToSelectedSingersGamePlay = () => {
    const { componentId } = this.props;
    GamePlayScreen.openSelectedSingers({ componentId, heartCount: 0 });
  };

  private back = () => {
    const { componentId } = this.props;
    pop(componentId);
  };
}

export default GameModeScreen;
