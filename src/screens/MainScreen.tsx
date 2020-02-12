import { Item } from "__generate__/api";
import _ from "lodash";
import React, { Component } from "react";
import { inject, observer, Observer } from "mobx-react";
import { InteractionManager, Clipboard } from "react-native";
import styled from "styled-components/native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import {
  Bold12,
  Bold14,
  Bold36,
  Regular10,
  Regular12,
  Bold20,
  Bold28
} from "src/components/text/Typographies";
import { IStore } from "src/stores/Store";
import { IAuthStore } from "src/stores/AuthStore";
import { IToastStore } from "src/stores/ToastStore";
import { SCREEN_IDS } from "src/screens/constant";
import { setRoot } from "src/utils/navigator";
import colors from "src/styles/colors";
import { ICodePushStore } from "src/stores/CodePushStore";
import { IPopupProps } from "src/hocs/withPopup";
import HeartGroup from "src/components/icon/HeartGroup";
import TimerText from "src/components/text/TimerText";
import InviteFriendsPopup from "src/components/popup/InviteFriendsPopup";
import ChargeSkipItemPopup from "src/components/popup/ChargeSkipItemPopup";
import { makeAppShareLink } from "src/utils/dynamicLink";
import RegisterSongScreen from "src/screens/song/RegisterSongScreen";
import GameRankingScreen from "src/screens/game/GameRankingScreen";
import GameModeScreen from "src/screens/game/GameModeScreen";
import { AdmobUnitID, loadAD, showAD } from "src/configs/admob";
import { rewardForWatchingAdUsingPOST, RewardType } from "src/apis/reward";
import UseFullHeartPopup from "src/components/popup/UseFullHeartPopup";
import LevelBadge from "src/components/badge/LevelBadge";
import XEIconButton from "src/components/button/XEIconButton";
import GamePlayScreen from "src/screens/game/GamePlayScreen";
import UserProfileScreen from "src/screens/user/UserProfileScreen";
import images from "src/images";
import { IForm } from "src/components/form/UserProfileForm";
import UnderlineText from "src/components/text/UnderlineText";
import UserItemPopup from "src/components/popup/UserItemPopup";
import GainFullHeartPopup from "src/components/popup/GainFullHeartPopup";
import DeveloperScreen from "src/screens/DeveloperScreen";
import Tooltip from "src/components/tooltip/Tooltip";
import { FIELD, setItem, defaultItemToBoolean } from "src/utils/storage";
import AutoHeightImage from "src/components/image/AutoHeightImage";
import { getDeviceWidth } from "src/utils/device";

interface IInject {
  store: IStore;
  authStore: IAuthStore;
  codePushStore: ICodePushStore;
  toastStore: IToastStore;
}

interface IProps extends IInject, IPopupProps {
  componentId: string;
}

interface IStates {
  isNotTooltipShow: boolean;
}

const Container = styled(ContainerWithStatusBar)``;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  padding-horizontal: 17px;
`;

const Profile = styled.View`
  position: absolute;
  top: 32px;
  left: 32px;
  flex-direction: column;
`;

const NicknameView = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Nickname = styled(Bold28)`
  color: ${colors.lightGrey};
`;

const SettingButton = styled(XEIconButton)``;

const DescriptionRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Description = styled(Bold20)`
  color: ${colors.lightGrey};
`;

const NoteIcon = styled.Image`
  width: 17px;
  height: 19px;
`;

const HeartStatus = styled.View`
  flex-direction: row;
  align-items: center;
`;

const HeartRemain = styled.View`
  flex-direction: column;
  margin-left: 5px;
`;

const HeartRemainText = styled(Regular10)`
  color: ${colors.paleLavender};
`;

const HeartRemainTime = styled(TimerText)`
  color: ${colors.white};
`;

const GameItemButton = styled.TouchableOpacity`
  position: absolute;
  top: 14px;
  right: 17px;
  width: 93px;
  height: 32px;
  border-radius: 17px;
  background-color: ${colors.purply};
  align-items: center;
  justify-content: center;
`;

const GameItemButtonText = styled(Bold14)`
  color: ${colors.paleLavender};
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const MainMirrorBallView = styled.View`
  position: absolute;
  top: 50px;
  left: 0px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const MainMirrorBallBackground = styled.Image`
  width: 244px;
  height: 310px;
  resize-mode: contain;
`;

const GameModeView = styled.View`
  flex-direction: column;
  align-items: center;
  padding-horizontal: 30px;
`;

const GameModeSection = styled.TouchableOpacity`
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 18px;
  background-color: ${colors.dark};
  margin-top: 8px;
  padding-top: 15px;
  padding-bottom: 21px;
`;

const GameModeTitle = styled(Bold20)`
  color: ${colors.white};
`;

const GameModeDescription = styled(Regular12)`
  color: ${colors.white};
`;

const LevelBadgesView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const LevelBadgeView = styled(LevelBadge)`
  margin-horizontal: 3.5px;
  margin-bottom: 16px;
`;

const Footer = styled.View`
  height: 100px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 25px;
  margin-top: 28px;
`;

const FooterButtonGroup = styled.TouchableOpacity`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SuggestionIcon = styled.Image`
  width: 43px;
  height: 43px;
  margin-bottom: 7px;
`;

const RankingIcon = styled.Image`
  width: 36px;
  height: 40px;
  margin-bottom: 4px;
`;

const FooterButtonText = styled(Bold12)`
  color: ${colors.white};
`;

const MainBackground = styled(AutoHeightImage)`
  position: absolute;
  top: 345px;
  left: 0px;
  resize-mode: contain;
`;

const DevelopButton = styled.TouchableWithoutFeedback``;

const DeveloperButtonView = styled.View`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 20px;
  height: 20px;
`;

const RegisterSongTooltipButtonView = styled.View`
  position: absolute;
  bottom: 93px;
  left: 17px;
`;

const RegisterSongTooltipButton = styled.TouchableOpacity``;

const RegisterSongTooltipView = styled(Tooltip)``;

// https://app.zeplin.io/project/5e1988a010ae36bcd391ba27/screen/5e335b9266ed997dfeb5627a
@inject(
  ({ store }: { store: IStore }): IInject => ({
    store,
    authStore: store.authStore,
    codePushStore: store.codePushStore,
    toastStore: store.toastStore
  })
)
@observer
class MainScreen extends Component<IProps, IStates> {
  public static open() {
    setRoot({
      nextComponentId: SCREEN_IDS.MainScreen
    });
  }

  constructor(props: IProps) {
    super(props);

    this.state = {
      isNotTooltipShow: true
    };

    loadAD(AdmobUnitID.HeartReward, ["game", "quiz"], {
      onRewarded: this.onRewarded
    });
    props.store.initializeMainApp();
  }

  public async componentDidMount() {
    this.updateCodePushIfAvailable();
    const isNotTooltipShow = await defaultItemToBoolean(
      FIELD.DO_NOT_SHOW_REGISTER_SONG_TOOLTIP,
      false
    );
    this.setState({ isNotTooltipShow });
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
    const heart = this.props.authStore.user?.heart;
    const user = this.props.authStore.user;
    return (
      <Container>
        <MainBackground
          width={getDeviceWidth()}
          widthRatio={375}
          heightRatio={228}
          source={images.bgMain}
        />
        <MainMirrorBallView>
          <MainMirrorBallBackground source={images.mainMirrorBall} />
        </MainMirrorBallView>
        <Header>
          <HeartStatus>
            <HeartGroup
              hearts={_.times(5, index =>
                index + 1 <= (heart?.heartCount ?? 0) ? "active" : "inactive"
              )}
            />
            <HeartRemain>
              <HeartRemainText>충전까지 남은 시간 : </HeartRemainText>
              <HeartRemainTime timeLeft={heart?.leftTime ?? 0} />
            </HeartRemain>
          </HeartStatus>
        </Header>
        <Content>
          <Profile>
            <NicknameView>
              <UnderlineText
                TextComponent={<Nickname>{user?.nickname ?? ""}님</Nickname>}
              />
              <SettingButton
                iconName="cog"
                iconSize={20}
                iconColor={colors.white}
                onPress={this.onSetting}
              />
            </NicknameView>
            <DescriptionRow>
              <Description>오늘도 같이 음악 맞춰요 </Description>
              <NoteIcon source={images.note} />
            </DescriptionRow>
          </Profile>
        </Content>
        <GameModeView>
          <GameModeSection onPress={this.navigateToGamePlay}>
            <LevelBadgesView>
              <LevelBadgeView level="SUPER HARD" />
            </LevelBadgesView>
            <GameModeTitle>랜덤으로 시작하기</GameModeTitle>
            <GameModeDescription>
              무작위로 문제가 출제됩니다.
            </GameModeDescription>
          </GameModeSection>
          <GameModeSection onPress={this.navigateToSelectedSingersGamePlay}>
            <LevelBadgesView>
              <LevelBadgeView level="HARD" />
              <LevelBadgeView level="MEDIUM" />
              <LevelBadgeView level="EASY" />
            </LevelBadgesView>
            <GameModeTitle>자신있는 가수 선택하기</GameModeTitle>
            <GameModeDescription>
              선택한 가수의 곡이 출제됩니다.
            </GameModeDescription>
          </GameModeSection>
        </GameModeView>
        <Footer>
          <FooterButtonGroup onPress={this.navigateToRegisterSong}>
            <SuggestionIcon source={images.btnCDIcon} />
            <FooterButtonText>노래 제안</FooterButtonText>
          </FooterButtonGroup>
          <FooterButtonGroup onPress={this.navigateToRanking}>
            <RankingIcon source={images.btnRankIcon} />
            <FooterButtonText>개인 랭킹</FooterButtonText>
          </FooterButtonGroup>
        </Footer>
        <GameItemButton onPress={this.onUserItemPopup}>
          <GameItemButtonText>보유 아이템</GameItemButtonText>
        </GameItemButton>
        <DevelopButton onPress={DeveloperScreen.open}>
          <DeveloperButtonView />
        </DevelopButton>
        {this.renderRegisterSongTooltip}
      </Container>
    );
  }

  private get renderRegisterSongTooltip() {
    const { isNotTooltipShow } = this.state;
    if (isNotTooltipShow) {
      return null;
    }
    return (
      <RegisterSongTooltipButtonView>
        <RegisterSongTooltipButton onPress={this.hideRegisterSongTooltip}>
          <RegisterSongTooltipView message="좋아하는 가수의 노래가 등록되어 있는지 확인할 수 있어요!" />
        </RegisterSongTooltipButton>
      </RegisterSongTooltipButtonView>
    );
  }

  private hideRegisterSongTooltip = () => {
    this.setState({ isNotTooltipShow: true }, async () => {
      await setItem(FIELD.DO_NOT_SHOW_REGISTER_SONG_TOOLTIP, "true");
    });
  };

  private onSetting = () => {
    const { componentId } = this.props;

    UserProfileScreen.open({
      componentId,
      onConfirm: this.updateUser
    });
  };

  private updateUser = async (data: IForm) => {
    const { showToast } = this.props.toastStore;
    const { nickname } = data;
    const { updateUser } = this.props.authStore;
    await updateUser({ nickname });
    showToast("닉네임 변경완료");
  };

  private useFullHeart = async () => {
    const { showToast } = this.props.toastStore;
    const userItem = this.props.authStore.user?.userItemsByItemType?.(
      Item.ItemTypeEnum.CHARGEALLHEART
    );
    await userItem?.useItemType?.();
    await this.props.authStore.user?.heart?.fetchHeart();
    showToast("하트 풀충전 완료!");
  };

  private requestHeartRewardAD = () => {
    showAD(AdmobUnitID.HeartReward);
  };

  private onRewarded = async () => {
    const { updateUserReward } = this.props.authStore;
    const { showToast } = this.props.toastStore;
    try {
      await rewardForWatchingAdUsingPOST(RewardType.AdMovie);
      updateUserReward();
      this.onGainFullHeartPopup();
    } catch (error) {
      showToast(error.message);
    }
  };

  private onGainFullHeartPopup = () => {
    const { showPopup, closePopup } = this.props.popupProps;
    const fullHeartCount =
      this.props.authStore.user?.userItemsByItemType(
        Item.ItemTypeEnum.CHARGEALLHEART
      )?.count ?? 0;
    showPopup(
      <GainFullHeartPopup heartCount={fullHeartCount} onConfirm={closePopup} />
    );
  };

  private onUserItemPopup = () => {
    const { showPopup, closePopup } = this.props.popupProps;
    showPopup(
      <Observer>
        {() => {
          const skipCount =
            this.props.authStore.user?.userItemsByItemType(
              Item.ItemTypeEnum.SKIP
            )?.count ?? 0;
          const fullHeartCount =
            this.props.authStore.user?.userItemsByItemType(
              Item.ItemTypeEnum.CHARGEALLHEART
            )?.count ?? 0;

          return (
            <UserItemPopup
              skipCount={skipCount}
              fullHeartCount={fullHeartCount}
              onInvite={this.invite}
              onAD={this.requestHeartRewardAD}
              onUseFullHeart={this.useFullHeart}
              onCancel={closePopup}
            />
          );
        }}
      </Observer>
    );
  };

  private invite = async () => {
    const { showToast } = this.props.toastStore;
    const { accessId } = this.props.authStore;
    const shortLink = await makeAppShareLink(accessId);
    Clipboard.setString(shortLink);
    showToast("공유 링크 복사 완료");
  };

  private navigateToGamePlay = () => {
    const { componentId } = this.props;
    const { showToast } = this.props.toastStore;
    const heart = this.props.authStore.user?.heart!;

    try {
      GamePlayScreen.open({ componentId, heartCount: heart?.heartCount ?? 0 });
    } catch (error) {
      showToast(error.message);
    }
  };

  private navigateToSelectedSingersGamePlay = () => {
    const { componentId } = this.props;
    const { showToast } = this.props.toastStore;
    const heart = this.props.authStore.user?.heart!;

    try {
      GamePlayScreen.openSelectedSingers({
        componentId,
        heartCount: heart?.heartCount ?? 0
      });
    } catch (error) {
      showToast(error.message);
    }
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

  private onSkipItemPopup = () => {
    const { showPopup, closePopup } = this.props.popupProps;
    showPopup(
      <ChargeSkipItemPopup onInvite={this.invite} onCancel={closePopup} />
    );
  };

  private onUseFullHeartPopup = () => {
    const { showPopup, closePopup } = this.props.popupProps;
    const heart = this.props.authStore.user?.heart!;
    showPopup(
      <UseFullHeartPopup
        heart={heart}
        onConfirm={this.useFullHeart}
        onChargeFullHeart={this.requestHeartRewardAD}
        onCancel={closePopup}
      />
    );
  };
}

export default MainScreen;
