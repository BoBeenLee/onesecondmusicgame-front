import _ from "lodash";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Clipboard } from "react-native";
import styled, { css } from "styled-components/native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold36 } from "src/components/text/Typographies";
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

interface IInject {
  authStore: IAuthStore;
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
}

interface IProps extends IInject, IParams, IPopupProps {}

const Container = styled(ContainerWithStatusBar)`
  flex: 1;
  flex-direction: column;
`;

const Header = styled.View`
  justify-content: center;
  align-items: center;
`;

const Title = styled(Bold36)``;

const Content = styled.View`
  align-items: center;
  padding-top: 26px;
`;

const ScoreView = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const GainScoreView = styled.View<{ size: number }>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  ${({ size }) => css`
    width: ${size}px;
    height: ${size}px;
    border-radius: ${_.round(size / 2)}px;
  `}
  background-color: #d8d8d8;
`;

const GainScore = styled(Bold36)``;

const GainScoreText = styled(Bold12)``;

const TotalScore = styled(Bold12)`
  position: absolute;
  bottom: 0px;
  right: 0px;
`;

const ScoreDescription = styled(Bold12)`
  padding-top: 26px;
  text-align: center;
`;

const Footer = styled.View`
  flex-direction: column;
  justify-content: center;
  padding-top: 100px;
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
  background-color: #b3b3b3;
`;

const RetryPlayButtonText = styled(Bold12)``;

@inject(
  ({ store }: { store: IStore }): IInject => ({
    authStore: store.authStore,
    toastStore: store.toastStore
  })
)
@observer
class GameResultScreen extends Component<IProps> {
  public static open(params: IParams) {
    return push({
      componentId: params.componentId,
      nextComponentId: SCREEN_IDS.GameResultScreen
    });
  }

  constructor(props: IProps) {
    super(props);

    loadAD(AdmobUnitID.HeartReward, ["game", "quiz"], {
      onRewarded: this.onRewarded
    });
  }

  public render() {
    const heart = this.props.authStore.user?.heart;

    return (
      <Container>
        <Header>
          <Title>Game over</Title>
        </Header>
        <Content>
          <ScoreView>
            <GainScoreView size={200}>
              <GainScore>20</GainScore>
              <GainScoreText>점</GainScoreText>
            </GainScoreView>
            <TotalScore>380점</TotalScore>
          </ScoreView>
          <ScoreDescription>{`놀랍네요!
혹시 당신 트둥이 아닌가요?`}</ScoreDescription>
        </Content>
        <Footer>
          <HeartGroup
            hearts={_.times(5, index =>
              index <= (heart?.heartCount ?? 0) ? "active" : "inactive"
            )}
          />
          <FooterRow1>
            <MockButton
              name="하트 풀 충전(ad)"
              onPress={this.onChargeFullHeartPopup}
            />
            <MockButton name="친구 초대" onPress={this.onInvitePopup} />
            <MockButton name="개인 랭킹" onPress={this.navigateToRanking} />
          </FooterRow1>
          <FooterRow1>
            <HomeButton name="홈" onPress={this.home} />
            <RetryPlayButton onPress={this.navigateToGamePlay}>
              <RetryPlayButtonText>다시 게임하기</RetryPlayButtonText>
            </RetryPlayButton>
          </FooterRow1>
        </Footer>
      </Container>
    );
  }

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
