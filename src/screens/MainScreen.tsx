import { Item } from "__generate__/api";
import _ from "lodash";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { InteractionManager, Clipboard } from "react-native";
import styled from "styled-components/native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold20, Bold36 } from "src/components/text/Typographies";
import { IStore } from "src/stores/Store";
import { IAuthStore } from "src/stores/AuthStore";
import { IToastStore } from "src/stores/ToastStore";
import { SCREEN_IDS } from "src/screens/constant";
import { setRoot } from "src/utils/navigator";
import colors from "src/styles/colors";
import { ICodePushStore } from "src/stores/CodePushStore";
import { IPopupProps } from "src/hocs/withPopup";
import MockButton from "src/components/button/MockButton";
import HeartGroup from "src/components/icon/HeartGroup";
import TimerText from "src/components/text/TimerText";
import InviteFriendsPopup from "src/components/popup/InviteFriendsPopup";
import ChargeSkipItemPopup from "src/components/popup/ChargeSkipItemPopup";
import { makeAppShareLink } from "src/utils/dynamicLink";
import RegisterSongScreen from "src/screens/RegisterSongScreen";
import GameRankingScreen from "src/screens/game/GameRankingScreen";
import GameModeScreen from "src/screens/game/GameModeScreen";
import { AdmobUnitID, loadAD, showAD } from "src/configs/admob";
import { rewardForWatchingAdUsingPOST, RewardType } from "src/apis/reward";
import UseFullHeartPopup from "src/components/popup/UseFullHeartPopup";
import FloatingButton from "src/components/button/FloatingButton";

interface IInject {
  store: IStore;
  authStore: IAuthStore;
  codePushStore: ICodePushStore;
  toastStore: IToastStore;
}

interface IProps extends IInject, IPopupProps {
  componentId: string;
}

const Container = styled(ContainerWithStatusBar)`
  flex: 1;
  flex-direction: column;
`;

const HeartStatus = styled.View`
  position: absolute;
  top: 20px;
  left: 21px;
`;

const HeartRemain = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: 5px;
`;

const HeartRemainText = styled(Bold12)``;

const HeartRemainTime = styled(TimerText)``;

const GameItems = styled.View`
  position: absolute;
  width: 100px;
  top: 20px;
  right: 31px;
  flex-direction: column;
`;

const GameItemButton = styled.View`
  padding: 10px;
  background-color: #eee;
`;

const GameItemButtonText = styled(Bold12)``;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Logo = styled(Bold36)`
  margin-bottom: 20px;
`;

const Footer = styled.View`
  height: 100px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

@inject(
  ({ store }: { store: IStore }): IInject => ({
    store,
    authStore: store.authStore,
    codePushStore: store.codePushStore,
    toastStore: store.toastStore
  })
)
@observer
class MainScreen extends Component<IProps> {
  public static open() {
    setRoot({
      nextComponentId: SCREEN_IDS.MainScreen
    });
  }

  public itemToOnPress: { [key in Item.ItemTypeEnum]: () => void };

  constructor(props: IProps) {
    super(props);

    this.itemToOnPress = {
      [Item.ItemTypeEnum.SKIP]: this.onSkipItemPopup,
      [Item.ItemTypeEnum.CHARGEALLHEART]: this.onUseFullHeartPopup
    };
    loadAD(AdmobUnitID.HeartReward, ["game", "quiz"], {
      onRewarded: this.onRewarded
    });
    props.store.initializeMainApp();
  }

  public async componentDidMount() {
    this.updateCodePushIfAvailable();
  }

  public updateCodePushIfAvailable = async () => {
    const {
      checkCodePushAvailability,
      updateCodePush
    } = this.props.codePushStore;

    if (await checkCodePushAvailability()) {
      InteractionManager.runAfterInteractions(async () => {
        await updateCodePush();
      });
    }
  };

  public render() {
    const userItemViews = this.props.authStore.user?.userItemViews ?? [];
    const heart = this.props.authStore.user?.heart;
    return (
      <Container>
        <Content>
          <HeartStatus>
            <HeartGroup
              hearts={_.times(5, index =>
                index <= (heart?.heartCount ?? 0) ? "active" : "inactive"
              )}
            />
            <HeartRemain>
              <HeartRemainText>충전까지 남은 시간 : </HeartRemainText>
              <HeartRemainTime
                seconds={heart?.leftTime ?? 0}
                onTimeEnd={this.chargeTime}
              />
            </HeartRemain>
          </HeartStatus>
          <GameItems>
            <FloatingButton
              ButtonComponent={
                <GameItemButton>
                  <GameItemButtonText>아이템</GameItemButtonText>
                </GameItemButton>
              }
              ItemComponents={_.map(userItemViews, item => (
                <MockButton
                  key={item.name}
                  name={`${item.name}(${item.count})`}
                  onPress={this.itemToOnPress[item.itemType]}
                />
              ))}
            />
          </GameItems>
          <Logo>알쏭달쏭</Logo>
          <MockButton name="가수선택" onPress={this.navigateToGameMode} />
        </Content>
        <Footer>
          <MockButton name="친구초대" onPress={this.onInvitePopup} />
          <MockButton name="음악 등록" onPress={this.navigateToRegisterSong} />
          <MockButton name="개인 랭킹" onPress={this.navigateToRanking} />
        </Footer>
      </Container>
    );
  }

  private chargeTime = () => {
    const heart = this.props.authStore.user?.heart;
    if (_.isEmpty(heart?.leftTime)) {
      heart?.fetchHeart?.();
    }
  };

  private onSkipItemPopup = () => {
    const { showPopup, closePopup } = this.props.popupProps;
    showPopup(
      <ChargeSkipItemPopup onConfirm={this.invite} onCancel={closePopup} />
    );
  };

  private onUseFullHeartPopup = () => {
    const { showPopup, closePopup } = this.props.popupProps;
    showPopup(
      <UseFullHeartPopup
        onConfirm={this.useFullHeart}
        onChargeFullHeart={this.requestHeartRewardAD}
        onCancel={closePopup}
      />
    );
  };

  private useFullHeart = () => {
    const { showToast } = this.props.toastStore;
    const userItem = this.props.authStore.user?.userItemsByItemType?.(
      Item.ItemTypeEnum.CHARGEALLHEART
    );

    const { closePopup } = this.props.popupProps;
    userItem?.useItemType?.();
    this.props.authStore.user?.heart?.fetchHeart();
    showToast("하트 풀충전 완료!");
    closePopup();
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

  private navigateToRegisterSong = () => {
    const { componentId } = this.props;
    RegisterSongScreen.open({
      componentId
    });
  };

  private navigateToRanking = () => {
    const { componentId } = this.props;
    GameRankingScreen.open({ componentId });
  };

  private navigateToGameMode = () => {
    const { componentId } = this.props;
    GameModeScreen.open({ componentId });
  };
}

export default MainScreen;
