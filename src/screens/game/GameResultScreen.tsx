import _ from "lodash";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styled, { css } from "styled-components/native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import {
  Bold18,
  Bold20,
  Bold27,
  Bold36,
  Bold14,
  Regular14,
  Bold24,
  Regular24,
  Bold16,
  Regular10,
  Bold12
} from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { setStackRoot } from "src/utils/navigator";
import colors from "src/styles/colors";
import HeartGroup from "src/components/icon/HeartGroup";
import { MainScreenStatic } from "src/screens/MainScreen";
import { IAuthStore } from "src/stores/AuthStore";
import { IToastStore } from "src/stores/ToastStore";
import { IStore } from "src/stores/Store";
import GameAllRankingScreen from "src/screens/game/GameAllRankingScreen";
import { PopupProps } from "src/hocs/withPopup";
import { AdmobUnitID, loadAD, AdmobUnit } from "src/configs/admob";
import { rewardForWatchingAdUsingPOST, RewardType } from "src/apis/reward";
import { makeAppShareLink } from "src/utils/dynamicLink";
import { GamePlayScreenStatic } from "src/screens/game/GamePlayScreen";
import GamePlayHighlights, {
  IGamePlayHighlights
} from "src/stores/GamePlayHighlights";
import { gameResultV2UsingPOST } from "src/apis/game";
import CircleCheckGroup from "src/components/icon/CircleCheckGroup";
import XEIcon from "src/components/icon/XEIcon";
import TimerText from "src/components/text/TimerText";
import UseFullHeartPopup from "src/components/popup/UseFullHeartPopup";
import {
  Item,
  ItemItemTypeEnum,
  GameResultResponse,
  ScoreViewModelScoreTypeEnum,
  GameResultResponseV2
} from "__generate__/api";
import GainFullHeartPopup from "src/components/popup/GainFullHeartPopup";
import images from "src/images";
import GameResultBanner from "src/components/banner/GameResultBanner";
import withLoading, { LoadingProps } from "src/hocs/withLoading";
import { logEvent } from "src/configs/analytics";
import GameImageThinBanner from "src/components/banner/GameImageThinBanner";

interface IInject {
  authStore: IAuthStore;
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
  gamePlayHighlights: () => IGamePlayHighlights;
}

interface IProps extends IInject, IParams, PopupProps, LoadingProps {}

interface IStates {
  gameResult: NoUndefinedField<GameResultResponseV2>;
}

const Container = styled(ContainerWithStatusBar)`
  flex: 1;
  flex-direction: column;
`;

const ScrollView = styled.ScrollView``;

const Header = styled.View`
  justify-content: center;
  align-items: center;
  padding-top: 21px;
`;

const Title = styled(Bold27)`
  color: ${colors.paleLavender};
`;

const GamePlayStep = styled(CircleCheckGroup)`
  margin-top: 27px;
  margin-bottom: 0px;
`;

const Content = styled.View`
  flex: 1;
  align-items: center;
  padding-top: 26px;
  padding-horizontal: 18px;
`;

const ScoreView = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const GainScoreView = styled.View<{ size: number }>`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${({ size }) => css`
    width: ${size}px;
    height: ${size}px;
    border-radius: ${_.round(size / 2)}px;
  `}
  ${({ size }) => css`
    shadow-color: ${colors.robinEggBlue};
    shadow-offset: 0px 0px;
    shadow-opacity: 1;
    shadow-radius: 6px;
    elevation: 3;
  `}
  border: solid 2px ${colors.robinEggBlue};
`;

const GainScoreTitle = styled(Bold14)`
  color: ${colors.paleLavender};
`;

const GainScore = styled(Bold36)`
  color: ${colors.veryLightPurple};
  margin-bottom: 21px;
`;

const TotalScoreTitle = styled(Regular14)`
  color: ${colors.lavender};
`;

const TotalScore = styled(Bold24)`
  color: ${colors.lavender};
`;

const ScoreDescription = styled(Regular24)`
  padding-top: 35px;
  text-align: center;
  color: ${colors.robinEggBlue};
`;

const ScoreHighlightDescription = styled(Bold24)`
  text-align: center;
  color: ${colors.robinEggBlue};
`;

const ResultSection = styled.TouchableOpacity`
  width: 100%;
  min-height: 97px;
  padding-vertical: 20px;
  padding-horizontal: 20px;
  flex-direction: column;
  justify-content: center;
  border-radius: 18px;
  background-color: ${colors.darkThree};
  margin-bottom: 12px;
`;

const ResultSectionGroup = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ResultSectionHeaderTitle = styled(Bold18)`
  color: ${colors.white};
`;

const ResultSectionHeaderSubTitle = styled(Bold14)`
  color: ${colors.white};
`;

const ResultSectionHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
`;

const RankingIcon = styled.Image`
  width: 16px;
  height: 18px;
  margin-right: 11px;
`;

const ResultSectionMyRankRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const RankType = styled(Regular14)`
  color: ${colors.lightGrey};
`;

const Rank = styled(Bold16)`
  color: ${colors.paleLavender};
  margin-right: 7px;
`;

const Name = styled(Bold16)`
  color: ${colors.paleLavender};
  margin-left: 10px;
`;

const Score = styled(Regular14)`
  width: 80px;
  color: ${colors.paleLavender};
  text-align: right;
`;

const ResultSectionRemainHeartRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const HeartRemain = styled.View`
  flex-direction: column;
`;

const HeartRemainText = styled(Regular10)`
  color: ${colors.paleLavender};
`;

const HeartRemainTime = styled(TimerText)`
  color: ${colors.white};
`;

const ArrowRightIcon = styled(XEIcon)``;

const Footer = styled.View`
  flex-direction: column;
  justify-content: center;
  padding-top: 42px;
  padding-horizontal: 16px;
`;

const FooterRow1 = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  margin-vertical: 10px;
`;

const HomeButton = styled.TouchableOpacity`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
`;

const HomeIcon = styled.Image`
  width: 42px;
  height: 36px;
  margin-bottom: 8px;
`;

const HomeButtonText = styled(Bold12)`
  color: ${colors.white};
`;

const RetryPlayButton = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-vertical: 16px;
  border-radius: 8px;
  border: solid 3px ${colors.lightMagenta};
  background-color: ${colors.pinkyPurple};
`;

const RetryPlayButtonText = styled(Bold20)`
  color: ${colors.lightGrey};
`;

@inject(
  ({ store }: { store: IStore }): IInject => ({
    authStore: store.authStore,
    toastStore: store.toastStore
  })
)
@observer
class GameResultScreen extends Component<IProps, IStates> {
  public static open(params: IParams) {
    const { componentId, ...restParams } = params;
    setStackRoot({
      componentId,
      nextComponentId: SCREEN_IDS.GameResultScreen,
      params: restParams,
      options: {
        popGesture: false
      }
    });
    logEvent.gameEnd();
  }

  public gamePlayHighlights: IGamePlayHighlights;
  public admobUnit: AdmobUnit;

  constructor(props: IProps) {
    super(props);

    this.state = {
      gameResult: {
        gainPointOfThisGame: 0,
        scoreViewModelList: [],
        heartCount: 0,
        resultComment: []
      }
    };

    const keywords = this.props.authStore.user?.advertise?.keywords ?? [];
    this.admobUnit = loadAD(AdmobUnitID.HeartReward, keywords, {
      onRewarded: this.onRewarded
    });
    this.gamePlayHighlights =
      props?.gamePlayHighlights?.() ?? GamePlayHighlights.create({});
    this.navigateToGamePlay =
      this.props.loadingProps.wrapperLoading?.(this.navigateToGamePlay) ??
      this.navigateToGamePlay;
  }

  public async componentDidMount() {
    await this.initialize();
  }

  public render() {
    const resultAdvertise = this.props.authStore.user?.advertise
      ?.resultAdvertise;
    const heart = this.props.authStore.user?.heart;
    const nickname = this.props.authStore.user?.nickname ?? "";
    const { gainPointOfThisGame, resultComment } = this.state.gameResult;
    const { gamePlayStepResultStatuses } = this.gamePlayHighlights;

    return (
      <Container>
        <ScrollView>
          {resultAdvertise ? (
            <GameImageThinBanner advertise={resultAdvertise} />
          ) : null}
          <Header>
            <Title>게임 종료</Title>
            <GamePlayStep circles={gamePlayStepResultStatuses} />
          </Header>
          <Content>
            <ScoreView>
              <GainScoreView size={200}>
                <GainScoreTitle>이번 게임 점수</GainScoreTitle>
                <GainScore>{gainPointOfThisGame}점</GainScore>
                <TotalScoreTitle>누적 점수</TotalScoreTitle>
                <TotalScore>
                  {this.monthlyScore?.score?.point ?? 0}점
                </TotalScore>
              </GainScoreView>
            </ScoreView>
            <ScoreDescription>
              <ScoreHighlightDescription>
                {resultComment?.[0]}
              </ScoreHighlightDescription>
              {"\n"}
              {resultComment?.[1]}
            </ScoreDescription>
          </Content>
          <Footer>
            <ResultSection onPress={this.navigateToRanking}>
              <ResultSectionHeaderRow>
                <ResultSectionGroup>
                  <RankingIcon source={images.btnRankIcon} />
                  <ResultSectionHeaderTitle>개인랭킹</ResultSectionHeaderTitle>
                </ResultSectionGroup>
                <ArrowRightIcon
                  name="angle-right"
                  size={15}
                  color={colors.white}
                />
              </ResultSectionHeaderRow>
              <ResultSectionMyRankRow>
                <RankType>월간랭킹</RankType>
                <ResultSectionGroup>
                  <Rank>{this.monthlyScore?.ranking ?? "??"}위</Rank>
                  <Name>{nickname}</Name>
                  <Score>{this.monthlyScore?.score?.point ?? 0}점</Score>
                </ResultSectionGroup>
              </ResultSectionMyRankRow>
              <ResultSectionMyRankRow>
                <RankType>시즌랭킹</RankType>
                <ResultSectionGroup>
                  <Rank>{this.seasonScore?.ranking ?? "??"}위</Rank>
                  <Name>{nickname}</Name>
                  <Score>{this.seasonScore?.score?.point ?? 0}점</Score>
                </ResultSectionGroup>
              </ResultSectionMyRankRow>
            </ResultSection>
            <ResultSection onPress={this.onUseFullHeartPopup}>
              <ResultSectionHeaderRow>
                <ResultSectionHeaderTitle>
                  잔여 하트갯수
                </ResultSectionHeaderTitle>
                <ResultSectionGroup>
                  <ResultSectionHeaderSubTitle>
                    하트 풀충전
                  </ResultSectionHeaderSubTitle>
                  <ArrowRightIcon
                    name="angle-right"
                    size={15}
                    color={colors.white}
                  />
                </ResultSectionGroup>
              </ResultSectionHeaderRow>
              <ResultSectionRemainHeartRow>
                <HeartRemain>
                  <HeartRemainText>충전까지 남은 시간 : </HeartRemainText>
                  <HeartRemainTime
                    seconds={heart?.leftTimeSeconds ?? 0}
                    onExpire={this.chargeTime}
                  />
                </HeartRemain>
                <HeartGroup
                  hearts={_.times(5, index =>
                    index + 1 <= (heart?.heartCount ?? 0)
                      ? "active"
                      : "inactive"
                  )}
                />
              </ResultSectionRemainHeartRow>
            </ResultSection>
            <FooterRow1>
              <HomeButton onPress={this.home}>
                <HomeIcon source={images.combinedShape} />
                <HomeButtonText>홈</HomeButtonText>
              </HomeButton>
              <RetryPlayButton onPress={this.navigateToGamePlay}>
                <RetryPlayButtonText>다시 게임하기</RetryPlayButtonText>
              </RetryPlayButton>
            </FooterRow1>
          </Footer>
        </ScrollView>
      </Container>
    );
  }

  private get seasonScore() {
    const { scoreViewModelList } = this.state.gameResult;
    return _.find(
      scoreViewModelList,
      item => item.scoreType === ScoreViewModelScoreTypeEnum.SEASON
    );
  }

  private get monthlyScore() {
    const { scoreViewModelList } = this.state.gameResult;
    return _.find(
      scoreViewModelList,
      item => item.scoreType === ScoreViewModelScoreTypeEnum.MONTHLY
    );
  }

  private chargeTime = async () => {
    const heart = this.props.authStore.user?.heart;
    await heart?.fetchHeart?.();
  };

  private initialize = async () => {
    const { toGameAnswers, playToken } = this.gamePlayHighlights;
    const response = await gameResultV2UsingPOST({
      gameAnswerList: toGameAnswers,
      playToken
    });
    await this.props.authStore.user?.heart?.fetchHeart();
    this.setState({
      gameResult: {
        gainPointOfThisGame: response.gainPointOfThisGame ?? 0,
        scoreViewModelList: (response.scoreViewModelList ?? []).map(item => {
          return {
            score: {
              point: item.score?.point ?? 0,
              id: item.score?.id ?? 0
            },
            ranking: item.ranking ?? 0,
            scoreType: item.scoreType!
          };
        }),
        heartCount: response.heartCount ?? 0,
        resultComment: response.resultComment ?? []
      }
    });
  };

  private onUseFullHeartPopup = () => {
    const { showPopup, closePopup } = this.props.popupProps;
    const userItem = this.props.authStore.user?.userItemsByItemType?.(
      ItemItemTypeEnum.CHARGEALLHEART
    );
    showPopup(
      <UseFullHeartPopup
        count={userItem?.count ?? 0}
        onConfirm={this.useFullHeart}
        onAD={this.requestHeartRewardAD}
        onCancel={closePopup}
      />
    );
  };

  private useFullHeart = () => {
    const { showToast } = this.props.toastStore;
    const userItem = this.props.authStore.user?.userItemsByItemType?.(
      ItemItemTypeEnum.CHARGEALLHEART
    );

    const { closePopup } = this.props.popupProps;
    userItem?.useItemType?.();
    this.props.authStore.user?.heart?.fetchHeart();
    showToast("하트 풀충전 완료!");
    closePopup();
  };

  private requestHeartRewardAD = () => {
    this.admobUnit.show();
  };

  private onRewarded = async () => {
    const { closePopup } = this.props.popupProps;
    const { updateUserReward } = this.props.authStore;
    const { showToast } = this.props.toastStore;
    try {
      await rewardForWatchingAdUsingPOST(RewardType.AdMovie);
      await updateUserReward();
      closePopup();
      this.onGainFullHeartPopup();
    } catch (error) {
      showToast(error.message);
    }
  };

  private onGainFullHeartPopup = () => {
    const { showPopup, closePopup } = this.props.popupProps;
    const fullHeartCount =
      this.props.authStore.user?.userItemsByItemType(
        ItemItemTypeEnum.CHARGEALLHEART
      )?.count ?? 0;
    showPopup(
      <GainFullHeartPopup heartCount={fullHeartCount} onConfirm={closePopup} />
    );
  };

  private navigateToGamePlay = async () => {
    const { componentId } = this.props;
    const { showToast } = this.props.toastStore;
    const heart = this.props.authStore.user?.heart!;
    try {
      await GamePlayScreenStatic.open({
        componentId,
        heartCount: heart?.heartCount ?? 0,
        selectedSingers: this.gamePlayHighlights.selectedSingers
      });
      logEvent.gameRestart();
    } catch (error) {
      showToast(error.message);
    }
  };

  private navigateToRanking = () => {
    const { componentId } = this.props;
    GameAllRankingScreen.open({ componentId });
  };

  private home = () => {
    MainScreenStatic.open();
  };
}

export default GameResultScreen;
