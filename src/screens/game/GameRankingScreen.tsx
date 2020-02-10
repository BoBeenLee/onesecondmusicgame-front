import React, { Component, ComponentClass } from "react";
import styled from "styled-components/native";
import { FlatListProps, FlatList, ListRenderItem } from "react-native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold14 } from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { push, pop } from "src/utils/navigator";
import BackTopBar from "src/components/topbar/BackTopBar";
import GameTopRankCard from "src/components/card/GameTopRankCard";
import GameRankCard from "src/components/card/GameRankCard";
import colors from "src/styles/colors";
import Ranks, { IRankItem } from "src/stores/Ranks";

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

const RankCaption = styled(Bold14)`
  color: #fff;
  align-self: flex-end;
`;

const Content = styled.View`
  flex: 1;
  padding-horizontal: 27px;
`;

const TopRankView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 13px;
`;

const GameTopRankCardView = styled(GameTopRankCard)`
  flex: 1;
  padding-horizontal: 10px;
`;

const Result = styled<ComponentClass<FlatListProps<IRankItem>>>(FlatList)`
  flex: 1;
  width: 100%;
  margin-top: 9px;
`;

const GameRankCardView = styled(GameRankCard)``;

const GameRankSeperator = styled.View`
  width: 100%;
  height: 13px;
`;

class GameRankingScreen extends Component<IProps> {
  public static open(params: IParams) {
    return push({
      componentId: params.componentId,
      nextComponentId: SCREEN_IDS.GameRankingScreen
    });
  }

  public ranks = Ranks.create();

  public render() {
    const { isRefresh, refresh, rankViews } = this.ranks;
    return (
      <Container>
        <BackTopBar title="랭킹" onBackPress={this.back} />
        <Content>
          <RankCaption>*NN시 NN분 기준의 랭킹입니다. </RankCaption>
          <TopRankView>
            <GameTopRankCardView
              rank={1}
              profileImage="https://via.placeholder.com/350x350"
              name="jasmin"
              score={83}
            />
            <GameTopRankCardView
              rank={2}
              profileImage="https://via.placeholder.com/350x350"
              name="jasmin"
              score={83}
            />
            <GameTopRankCardView
              rank={3}
              profileImage="https://via.placeholder.com/350x350"
              name="jasmin"
              score={83}
            />
          </TopRankView>
          <Result
            data={rankViews}
            renderItem={this.renderRankItem}
            keyExtractor={this.rankKeyExtreactor}
            refreshing={isRefresh}
            onRefresh={refresh}
            ItemSeparatorComponent={GameRankSeperator}
          />
        </Content>
      </Container>
    );
  }

  private rankKeyExtreactor = (item: IRankItem, index: number) => {
    return `${index}`;
  };

  private renderRankItem: ListRenderItem<IRankItem> = ({ item }) => {
    return <GameRankCardView {...item} />;
  };

  private back = () => {
    const { componentId } = this.props;
    pop(componentId);
  };
}

export default GameRankingScreen;
