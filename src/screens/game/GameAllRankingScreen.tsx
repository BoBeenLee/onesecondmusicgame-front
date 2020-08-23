import _ from "lodash";
import React, { Component, ComponentClass } from "react";
import { inject, observer, Observer } from "mobx-react";
import styled from "styled-components/native";
import { FlatListProps, FlatList, ListRenderItem } from "react-native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Regular14, Bold18 } from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { push, pop } from "src/utils/navigator";
import BackTopBar from "src/components/topbar/BackTopBar";
import GameTopRankCard from "src/components/card/GameTopRankCard";
import GameRankCard from "src/components/card/GameRankCard";
import colors from "src/styles/colors";
import MonthlyRanks from "src/stores/MonthlyRanks";
import { RankView } from "__generate__/api";
import { IToastStore } from "src/stores/ToastStore";
import { IStore } from "src/stores/Store";
import { transformTimeToString } from "src/utils/date";
import images from "src/images";
import RankTabItem from "src/components/tab/item/RankTabItem";
import TransparentTabView, {
  IRoute
} from "src/components/tab/TransparentTabView";
import SeasonRanks from "src/stores/SeasonRanks";
import PreviousSeasonTop3Card from "src/components/card/PreviousSeasonTop3Card";

type RouteItem = {
  name: string;
} & IRoute;

interface IInject {
  toastStore: IToastStore;
}

type Params = {
  componentId: string;
};

type Props = {
  componentId: string;
};

type States = {
  routeIndex: number;
};

const Container = styled(ContainerWithStatusBar)`
  flex: 1;
  flex-direction: column;
`;

const RankTabs = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

const RankTab = styled(RankTabItem)`
  flex: 1;
`;

const TabContent = styled(TransparentTabView)``;

const TitleGroup = styled.View`
  flex-direction: column;
  align-items: center;
  width: 301px;
  height: 72px;
  margin-top: 30px;
`;

const Title = styled(Bold18)`
  color: ${colors.straw};
  margin-top: 10px;
  letter-spacing: 2.25px;
`;

const TitleBackgroundImage = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const MonthlyRank = styled.View`
  flex: 1;
  flex-direction: column;
`;

const RankCaption = styled(Regular14)`
  text-align: center;
  color: ${colors.lightGrey};
  margin-top: 14px;
  margin-bottom: 19px;
`;

const RankHeader = styled.View`
  flex-direction: column;
  align-items: center;
`;

const PreviousSeasonTop3 = styled(PreviousSeasonTop3Card)`
  margin-top: 48px;
  margin-bottom: 20px;
`;

const TopRankView = styled.View`
  width: 340px;
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

const RankBottom = styled.View`
  flex-direction: column;
  align-items: center;
`;

const TopArrowIcon = styled.Image`
  width: 37px;
  height: 32px;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const GameRankCardView = styled.View`
  width: 100%;
  padding-left: 12px;
  padding-right: 12px;
`;

const MyGameRankCard = styled(GameRankCard)`
  width: 100%;
  background-color: ${colors.pinkyPurple};
  border-radius: 0px;
`;

const GameRankSeperator = styled.View`
  width: 100%;
  height: 13px;
`;

const Podium = styled.Image`
  width: 100%;
  height: 140px;
`;

const LightBackground = styled.Image`
  width: 100%;
  height: 100%;
  position: absolute;
`;

@inject(
  ({ store }: { store: IStore }): IInject => ({
    toastStore: store.toastStore
  })
)
@observer
class GameAllRankingScreen extends Component<Props, States> {
  public static open(params: Params) {
    return push({
      componentId: params.componentId,
      nextComponentId: SCREEN_IDS.GameAllRankingScreen
    });
  }

  public monthlyRanks = MonthlyRanks.create();
  public seasonRanks = SeasonRanks.create();
  public routes: RouteItem[] = [];

  constructor(props: Props) {
    super(props);

    this.state = {
      routeIndex: 0
    };

    this.routes = [
      {
        key: "monthly",
        name: "월간 랭킹",
        renderRoute: this.renderMonthlyRanking
      },
      {
        key: "season",
        name: "시즌 랭킹",
        renderRoute: this.renderSeasonRanking
      }
    ];
    this.monthlyRanks.initialize();
    this.seasonRanks.initialize();
  }

  public render() {
    const { routeIndex } = this.state;
    return (
      <Container>
        <LightBackground source={images.lightRanking} />
        <BackTopBar title="개인 랭킹" onBackPress={this.back} />
        <RankTabs>
          {_.map(this.routes, (route, index) => {
            const { name } = route;
            return (
              <RankTab
                key={`rankTab${index}`}
                active={routeIndex === index}
                title={name}
                onSelected={_.partial(this.onSelectedRoute, index)}
              />
            );
          })}
        </RankTabs>
        <TabContent routes={this.routes} tabIndex={routeIndex} />
      </Container>
    );
  }

  private onSelectedRoute = (routeIndex: number) => {
    this.setState({
      routeIndex
    });
  };

  private renderMonthlyRanking = () => {
    return (
      <Observer>
        {() => {
          const { isRefresh, refresh, time, rankViews } = this.monthlyRanks;
          const [firstRank, secondRank, thirdRank, ...restRank] = rankViews;

          return (
            <MonthlyRank>
              {this.renderRanks({
                ListHeaderComponent: (
                  <RankHeader>
                    <TitleGroup>
                      <TitleBackgroundImage source={images.bgRankTitle} />
                      <Title>2020년 8월의 음잘알</Title>
                    </TitleGroup>
                    <TopRankView>
                      <GameTopRankCardView
                        rank={2}
                        profileImage={secondRank?.profileImageUrl ?? ""}
                        name={secondRank?.nickname ?? ""}
                        score={secondRank?.point ?? 0}
                      />
                      <GameTopRankCardView
                        rank={1}
                        profileImage={firstRank?.profileImageUrl ?? ""}
                        name={firstRank?.nickname ?? ""}
                        score={firstRank?.point ?? 0}
                      />
                      <GameTopRankCardView
                        rank={3}
                        profileImage={thirdRank?.profileImageUrl ?? ""}
                        name={thirdRank?.nickname ?? ""}
                        score={thirdRank?.point ?? 0}
                      />
                    </TopRankView>
                    <Podium resizeMode="contain" source={images.podium} />
                    <RankCaption>
                      *{transformTimeToString(time, "YYYY-MM-DD HH시 mm분 ")}
                      기준의 랭킹입니다.{" "}
                    </RankCaption>
                  </RankHeader>
                ),
                rankViews: restRank
              })}
            </MonthlyRank>
          );
        }}
      </Observer>
    );
  };

  private renderSeasonRanking = () => {
    return (
      <Observer>
        {() => {
          const { time, rankViews, myRank, lastSeasonTop3 } = this.seasonRanks;
          const [firstRank, secondRank, thirdRank, ...restRank] = rankViews;

          return (
            <MonthlyRank>
              {this.renderRanks({
                ListHeaderComponent: (
                  <RankHeader>
                    <TitleGroup>
                      <TitleBackgroundImage source={images.bgRankTitle} />
                      <Title>2020년 8월의 음잘알</Title>
                    </TitleGroup>
                    <PreviousSeasonTop3
                      title="지난 시즌2 TOP 3 음잘알"
                      data={_.slice(
                        _.map(lastSeasonTop3, item => {
                          return {
                            name: item.nickname ?? "",
                            point: item.point ?? 0
                          };
                        }),
                        0,
                        3
                      )}
                    />
                    <TopRankView>
                      <GameTopRankCardView
                        rank={2}
                        profileImage={secondRank?.profileImageUrl ?? ""}
                        name={secondRank?.nickname ?? ""}
                        score={secondRank?.point ?? 0}
                      />
                      <GameTopRankCardView
                        rank={1}
                        profileImage={firstRank?.profileImageUrl ?? ""}
                        name={firstRank?.nickname ?? ""}
                        score={firstRank?.point ?? 0}
                      />
                      <GameTopRankCardView
                        rank={3}
                        profileImage={thirdRank?.profileImageUrl ?? ""}
                        name={thirdRank?.nickname ?? ""}
                        score={thirdRank?.point ?? 0}
                      />
                    </TopRankView>
                    <Podium resizeMode="contain" source={images.podium} />
                    <RankCaption>
                      *{transformTimeToString(time, "YYYY-MM-DD HH시 mm분 ")}
                      기준의 랭킹입니다.{" "}
                    </RankCaption>
                  </RankHeader>
                ),
                ListFooterComponent: (
                  <RankBottom>
                    <TopArrowIcon source={images.icTopArrow} />
                    <MyGameRankCard
                      rank={0}
                      profileImage={myRank?.profileImageUrl ?? ""}
                      name={myRank?.nickname ?? ""}
                      score={myRank?.point ?? 0}
                      rankDiff={myRank?.rankDiff ?? 0}
                    />
                  </RankBottom>
                ),
                rankViews: restRank
              })}
            </MonthlyRank>
          );
        }}
      </Observer>
    );
  };

  private renderRanks = ({
    ListHeaderComponent,
    ListFooterComponent,
    rankViews
  }: {
    ListHeaderComponent: React.ComponentType<any> | React.ReactElement | null;
    ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
    rankViews: RankView[];
  }) => {
    const { isRefresh, refresh, time } = this.monthlyRanks;
    return (
      <Result
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        data={rankViews}
        renderItem={this.renderRankItem}
        keyExtractor={this.rankKeyExtreactor}
        refreshing={isRefresh}
        onRefresh={refresh}
        ItemSeparatorComponent={GameRankSeperator}
      />
    );
  };

  private rankKeyExtreactor = (item: RankView, index: number) => {
    return `${index}`;
  };

  private renderRankItem: ListRenderItem<RankView> = ({ item, index }) => {
    return (
      <GameRankCardView>
        <GameRankCard
          rank={index + 4}
          profileImage={item?.profileImageUrl ?? ""}
          name={item?.nickname ?? ""}
          score={item?.point ?? 0}
          rankDiff={item?.rankDiff ?? 0}
        />
      </GameRankCardView>
    );
  };

  private back = () => {
    const { componentId } = this.props;
    pop(componentId);
  };
}

export default GameAllRankingScreen;
