import _ from "lodash";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Clipboard } from "react-native";
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
  Regular10
} from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { push, pop } from "src/utils/navigator";
import { TOP_BAR_HEIGHT } from "src/components/topbar/OSMGTopBar";
import colors from "src/styles/colors";
import MockButton from "src/components/button/MockButton";
import HeartGroup from "src/components/icon/HeartGroup";
import MainScreen from "src/screens/MainScreen";
import { IAuthStore } from "src/stores/AuthStore";
import { IToastStore } from "src/stores/ToastStore";
import { IStore } from "src/stores/Store";
import GameRankingScreen from "src/screens/game/GameRankingScreen";
import ChargeFullHeartPopup from "src/components/popup/ChargeFullHeartPopup";
import InviteFriendsPopup from "src/components/popup/InviteFriendsPopup";
import { IPopupProps } from "src/hocs/withPopup";
import { AdmobUnitID, loadAD, showAD } from "src/configs/admob";
import { rewardForWatchingAdUsingPOST, RewardType } from "src/apis/reward";
import { makeAppShareLink } from "src/utils/dynamicLink";
import GamePlayScreen from "src/screens/game/GamePlayScreen";
import GamePlayHighlights, {
  IGamePlayHighlights
} from "src/stores/GamePlayHighlights";
import { gameResultUsingPOST } from "src/apis/game";
import CircleCheckGroup from "src/components/icon/CircleCheckGroup";
import XEIcon from "src/components/icon/XEIcon";
import TimerText from "src/components/text/TimerText";

interface IInject {
  authStore: IAuthStore;
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
  gamePlayHighlights: () => IGamePlayHighlights;
}

interface IProps extends IInject, IParams, IPopupProps {}

interface IStates {
  gainPointOfThisGame: number;
  totalPoint: number;
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
  margin-bottom: 32px;
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
    shadow-radius: ${_.round(size / 2)}px;
    elevation: 4;
  `}
  background-color: ${colors.darkGreyBlue};
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
  height: 97px;
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

const ResultSectionMyRankRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Rank = styled(Bold16)`
  color: ${colors.paleLavender};
`;

const Name = styled(Bold16)`
  color: ${colors.paleLavender};
`;

const Score = styled(Regular14)`
  color: ${colors.paleLavender};
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

const HomeButton = styled(MockButton)`
  margin-right: 20px;
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
    return push({
      componentId,
      nextComponentId: SCREEN_IDS.GameResultScreen,
      params: restParams
    });
  }

  public gamePlayHighlights: IGamePlayHighlights;

  constructor(props: IProps) {
    super(props);

    this.state = {
      gainPointOfThisGame: 0,
      totalPoint: 0
    };

    loadAD(AdmobUnitID.HeartReward, ["game", "quiz"], {
      onRewarded: this.onRewarded
    });
    this.gamePlayHighlights =
      props?.gamePlayHighlights?.() ?? GamePlayHighlights.create({});
  }

  public componentDidMount() {
    this.initialize();
  }

  public render() {
    const heart = this.props.authStore.user?.heart;
    const { gainPointOfThisGame, totalPoint } = this.state;
    const { gamePlayStepStatuses } = this.gamePlayHighlights;

    return (
      <Container>
        <ScrollView>
          <Header>
            <Title>게임 종료</Title>
            <GamePlayStep circles={gamePlayStepStatuses} />
          </Header>
          <Content>
            <ScoreView>
              <GainScoreView size={200}>
                <GainScoreTitle>이번 게임 점수</GainScoreTitle>
                <GainScore>{gainPointOfThisGame}점</GainScore>
                <TotalScoreTitle>누적 점수</TotalScoreTitle>
                <TotalScore>{totalPoint}점</TotalScore>
              </GainScoreView>
            </ScoreView>
            <ScoreDescription>
              <ScoreHighlightDescription>놀랍네요!</ScoreHighlightDescription>
              {"\n"}
              혹시 당신 트둥이 아닌가요?
            </ScoreDescription>
          </Content>
          <Footer>
            <ResultSection onPress={this.navigateToRanking}>
              <ResultSectionHeaderRow>
                <ResultSectionHeaderTitle>개인랭킹</ResultSectionHeaderTitle>
                <ArrowRightIcon
                  name="angle-right"
                  size={15}
                  color={colors.white}
                />
              </ResultSectionHeaderRow>
              <ResultSectionMyRankRow>
                <ResultSectionGroup>
                  <Rank>1위</Rank>
                  <Name>이보빈</Name>
                </ResultSectionGroup>
                <Score>4355점</Score>
              </ResultSectionMyRankRow>
            </ResultSection>
            <ResultSection onPress={this.onChargeFullHeartPopup}>
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
                    seconds={heart?.leftTime ?? 0}
                    onTimeEnd={this.chargeTime}
                  />
                </HeartRemain>
                <HeartGroup
                  hearts={_.times(5, index =>
                    index <= (heart?.heartCount ?? 0) ? "active" : "inactive"
                  )}
                />
              </ResultSectionRemainHeartRow>
            </ResultSection>
            <FooterRow1>
              <HomeButton name="홈" onPress={this.home} />
              <RetryPlayButton onPress={this.navigateToGamePlay}>
                <RetryPlayButtonText>다시 게임하기</RetryPlayButtonText>
              </RetryPlayButton>
            </FooterRow1>
          </Footer>
        </ScrollView>
      </Container>
    );
  }

  private chargeTime = () => {
    const heart = this.props.authStore.user?.heart;
    if (_.isEmpty(heart?.leftTime)) {
      heart?.fetchHeart?.();
    }
  };

  private initialize = async () => {
    const { toGameAnswers, playToken } = this.gamePlayHighlights;
    const response = await gameResultUsingPOST({
      gameAnswerList: toGameAnswers,
      playToken
    });
    this.setState({
      gainPointOfThisGame: response.gainPointOfThisGame ?? 0,
      totalPoint: response.totalPoint ?? 0
    });
  };

  private onChargeFullHeartPopup = () => {
    const { showPopup, closePopup } = this.props.popupProps;
    showPopup(
      <ChargeFullHeartPopup
        onConfirm={this.requestHeartRewardAD}
        onCancel={closePopup}
      />
    );
  };

  private requestHeartRewardAD = () => {
    showAD(AdmobUnitID.HeartReward);
  };

  private onRewarded = async () => {
    const { closePopup } = this.props.popupProps;
    const { updateUserInfo } = this.props.authStore;
    const { showToast } = this.props.toastStore;
    try {
      await rewardForWatchingAdUsingPOST(RewardType.AdMovie);
      await updateUserInfo();
      showToast("보상 완료!");
    } catch (error) {
      showToast(error.message);
    } finally {
      closePopup();
    }
  };

  private onInvitePopup = () => {
    const { showPopup, closePopup } = this.props.popupProps;
    showPopup(
      <InviteFriendsPopup onConfirm={this.invite} onCancel={closePopup} />
    );
  };

  private invite = async () => {
    const { closePopup } = this.props.popupProps;
    const { showToast } = this.props.toastStore;
    const { accessId } = this.props.authStore;
    const shortLink = await makeAppShareLink(accessId);
    Clipboard.setString(shortLink);
    showToast("공유 링크 복사 완료");
    closePopup();
  };

  private navigateToGamePlay = () => {
    const { componentId } = this.props;
    GamePlayScreen.open({ componentId });
  };

  private navigateToRanking = () => {
    const { componentId } = this.props;
    GameRankingScreen.open({ componentId });
  };

  private home = () => {
    MainScreen.open();
  };
}

export default GameResultScreen;
