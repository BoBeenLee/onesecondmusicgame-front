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
import OnlyConfirmPopup from "src/components/popup/OnlyConfirmPopup";
import { makeAppShareLink } from "src/utils/dynamicLink";
import RegisterSongScreen from "src/screens/RegisterSongScreen";
import GameRankingScreen from "src/screens/game/GameRankingScreen";
import GameModeScreen from "src/screens/game/GameModeScreen";

interface IInject {
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
  top: 20px;
  right: 31px;
  flex-direction: column;
`;

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

const PopupContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const PopupTitle = styled(Bold20)`
  margin-top: 33px;
  margin-bottom: 33px;
`;

const PopupDescription = styled(Bold12)`
  margin-bottom: 47px;
`;

@inject(
  ({ store }: { store: IStore }): IInject => ({
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
    const userItemViews = this.props.authStore.user?.userItemViews;
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
            <MockButton name="아이템" onPress={_.identity} />
            {_.map(userItemViews, item => (
              <MockButton
                key={item.name}
                name={`${item.name}(${item.count})`}
                onPress={_.identity}
              />
            ))}
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

  private onInvitePopup = () => {
    const { showPopup, closePopup } = this.props.popupProps;
    showPopup(
      <OnlyConfirmPopup
        ContentComponent={
          <PopupContainer>
            <PopupTitle>친구 초대하기</PopupTitle>
            <PopupDescription>{`친구를 초대하면 
하트 풀충전 + 스킵 아이템을 각각 1개씩 드려요!`}</PopupDescription>
          </PopupContainer>
        }
        confirmText={"초대하기"}
        onConfirm={this.invite}
        onCancel={closePopup}
      />
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
