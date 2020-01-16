import React, { Component } from "react";
import styled from "styled-components/native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold14 } from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { push, pop } from "src/utils/navigator";
import CircleCheckGroup from "src/components/icon/CircleCheckGroup";
import LimitTimeProgress from "src/components/progress/LimitTimeProgress";
import colors from "src/styles/colors";
import OSMGCarousel, { ICarousel } from "src/components/carousel/OSMGCarousel";
import GameAudioPlayer from "src/components/player/GameAudioPlayer";

interface IParams {
  componentId: string;
}

interface IProps {
  componentId: string;
}

interface IStates {
  currentStep: number;
}

interface ICarouselItem extends ICarousel {
  source: { uri: string };
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

const GamePlayers = styled(OSMGCarousel)`
  padding-top: 40px;
`;

const SlideItemView = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: #eee;
`;

const Logo = styled(Bold14)``;

const MOCK_PLAYER_DATA: ICarouselItem[] = [
  {
    key: "1",
    source: {
      uri: "https://picsum.photos/200/300/?random"
    }
  },
  {
    key: "2",
    source: {
      uri: "https://picsum.photos/200/300/?random"
    }
  },
  {
    key: "3",
    source: {
      uri: "https://picsum.photos/200/300/?random"
    }
  }
];

class GamePlayScreen extends Component<IProps, IStates> {
  public static open(params: IParams) {
    return push({
      componentId: params.componentId,
      nextComponentId: SCREEN_IDS.GamePlayScreen
    });
  }

  constructor(props: IProps) {
    super(props);
    this.state = {
      currentStep: 0
    };
  }

  public render() {
    return (
      <Container>
        <Header>
          <Lifes circles={["active", "inactive", "check"]} />
          <LimitTimeProgress seconds={60} onTimeEnd={this.onLimitTimeEnd} />
        </Header>
        <Content>
          <GamePlayers
            data={MOCK_PLAYER_DATA}
            itemWidth={240}
            renderItem={this.renderItem}
            onSnapToItem={this.onSnapToItem}
          />
          <Logo>GamePlay</Logo>
        </Content>
      </Container>
    );
  }

  private renderItem = ({ item }: { item: any; index: number }) => {
    return (
      <SlideItemView>
        <GameAudioPlayer
          size={200}
          source={{
            uri:
              "https://api.soundcloud.com/tracks/736765723/stream?client_id=a281614d7f34dc30b665dfcaa3ed7505"
          }}
        />
      </SlideItemView>
    );
  };

  private onSnapToItem = (index: number) => {
    this.setState({ snapToItem: index });
  };

  private onLimitTimeEnd = () => {
    // NOTHING
  };

  private back = () => {
    const { componentId } = this.props;
    pop(componentId);
  };
}

export default GamePlayScreen;
