import React, { Component, ComponentClass } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";
import {
  FlatListProps,
  FlatList,
  ListRenderItem,
  ScrollView
} from "react-native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Regular14 } from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { push, pop } from "src/utils/navigator";
import BackTopBar from "src/components/topbar/BackTopBar";
import GameTopRankCard from "src/components/card/GameTopRankCard";
import GameRankCard from "src/components/card/GameRankCard";
import colors from "src/styles/colors";
import Ranks from "src/stores/Ranks";
import { RankView } from "__generate__/api";
import { IToastStore } from "src/stores/ToastStore";
import { IStore } from "src/stores/Store";
import { transformTimeToString } from "src/utils/date";
import images from "src/images";

const DEFAULT_PROFILE = "https://via.placeholder.com/350x350";

interface IInject {
  toastStore: IToastStore;
}

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
  display: flex;
  justify-content: center;
`;

const RankCaption = styled(Regular14)`
  text-align: center;
  color: ${colors.lightGrey};
  margin-top: 14px;
  margin-bottom: 19px;
`;

const Content = styled.View`
  flex: 1;
  padding-horizontal: 27px;
`;

const TopRankView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  padding-top: 13px;
`;

const GameTopRankCardView = styled(GameTopRankCard)`
  flex: 1;
`;

const Result = styled<ComponentClass<FlatListProps<RankView>>>(FlatList)`
  flex: 1;
  width: 100%;
`;

const GameRankCardView = styled(GameRankCard)``;

const GameRankSeperator = styled.View`
  width: 100%;
  height: 13px;
`;

const Podium = styled.Image`
  width: 100%;
  height: 140px;
`;

const mockData = [
  {
    nickname: "a",
    point: 2000,
    profileImageUrl: DEFAULT_PROFILE,
    rankDiff: 3
  },
  {
    nickname: "b",
    point: 1000,
    profileImageUrl: DEFAULT_PROFILE,
    rankDiff: -1
  },
  { nickname: "c", point: 900, profileImageUrl: DEFAULT_PROFILE, rankDiff: 2 },
  { nickname: "d", point: 800, profileImageUrl: DEFAULT_PROFILE, rankDiff: 4 },
  { nickname: "e", point: 700, profileImageUrl: DEFAULT_PROFILE, rankDiff: -2 },
  {
    nickname: "f",
    point: 0,
    profileImageUrl: DEFAULT_PROFILE,
    rankDiff: 2
  },
  { nickname: "g", point: 600, profileImageUrl: DEFAULT_PROFILE, rankDiff: 0 },
  { nickname: "h", point: 500, profileImageUrl: DEFAULT_PROFILE, rankDiff: 0 },
  { nickname: "i", point: 400, profileImageUrl: DEFAULT_PROFILE, rankDiff: 0 },
  { nickname: "j", point: 300, profileImageUrl: DEFAULT_PROFILE, rankDiff: 0 }
];

@inject(
  ({ store }: { store: IStore }): IInject => ({
    toastStore: store.toastStore
  })
)
@observer
class GameRankingScreen extends Component<IProps> {
  public static open(params: IParams) {
    return push({
      componentId: params.componentId,
      nextComponentId: SCREEN_IDS.GameRankingScreen
    });
  }

  public ranks = Ranks.create();

  constructor(props: IProps) {
    super(props);
    this.ranks.initialize();
  }

  public render() {
    const { isRefresh, refresh, time, rankViews } = this.ranks;
    const [firstRank, secondRank, thirdRank, ...restRank] = rankViews;
    return (
      <Container>
        <BackTopBar title="랭킹" onBackPress={this.back} />
        <ScrollView>
          <Content>
            <Header>
              <TopRankView>
                <GameTopRankCardView
                  rank={2}
                  profileImage={secondRank?.profileImageUrl ?? DEFAULT_PROFILE}
                  name={secondRank?.nickname ?? ""}
                  score={secondRank?.point ?? 0}
                />
                <GameTopRankCardView
                  rank={1}
                  profileImage={firstRank?.profileImageUrl ?? DEFAULT_PROFILE}
                  name={firstRank?.nickname ?? ""}
                  score={firstRank?.point ?? 0}
                />
                <GameTopRankCardView
                  rank={3}
                  profileImage={thirdRank?.profileImageUrl ?? DEFAULT_PROFILE}
                  name={thirdRank?.nickname ?? ""}
                  score={thirdRank?.point ?? 0}
                />
              </TopRankView>
              <Podium resizeMode="contain" source={images.podium} />
              <RankCaption>
                *{transformTimeToString(time, "YYYY-MM-DD HH시 mm분 ")}
                기준의 랭킹입니다.{" "}
              </RankCaption>
            </Header>
            <Result
              data={restRank}
              renderItem={this.renderRankItem}
              keyExtractor={this.rankKeyExtreactor}
              refreshing={isRefresh}
              onRefresh={refresh}
              ItemSeparatorComponent={GameRankSeperator}
            />
          </Content>
        </ScrollView>
      </Container>
    );
  }

  private rankKeyExtreactor = (item: RankView, index: number) => {
    return `${index}`;
  };

  private renderRankItem: ListRenderItem<RankView> = ({ item, index }) => {
    return (
      <GameRankCardView
        rank={index + 4}
        profileImage={item?.profileImageUrl ?? DEFAULT_PROFILE}
        name={item?.nickname ?? ""}
        score={item?.point ?? 0}
        rankDiff={item?.rankDiff ?? 0}
      />
    );
  };

  private back = () => {
    const { componentId } = this.props;
    pop(componentId);
  };
}

export default GameRankingScreen;
