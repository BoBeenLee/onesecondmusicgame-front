import _ from "lodash";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Clipboard, InteractionManager } from "react-native";
import styled from "styled-components/native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold14 } from "src/components/text/Typographies";
import { IStore } from "src/stores/Store";
import { IAuthStore } from "src/stores/AuthStore";
import { IToastStore } from "src/stores/ToastStore";
import { SCREEN_IDS } from "src/screens/constant";
import { setRoot } from "src/utils/navigator";
import colors from "src/styles/colors";
import AudioPlayer from "src/components/AudioPlayer";
import { makeAppShareLink } from "src/utils/dynamicLink";
import { AdmobUnitID, loadAD, showAD } from "src/configs/admob";
import SearchTrackScreen from "src/screens/SearchTrackScreen";
import { ICodePushStore } from "src/stores/CodePushStore";
import { rewardForWatchingAdUsingPOST, RewardType } from "src/apis/reward";

interface IInject {
  authStore: IAuthStore;
  codePushStore: ICodePushStore;
  toastStore: IToastStore;
}

interface IProps extends IInject {
  componentId: string;
}

const Container = styled(ContainerWithStatusBar)`
  flex: 1;
  flex-direction: column;
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ADButton = styled.TouchableOpacity``;

const ButtonText = styled(Bold12)``;

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
    loadAD(AdmobUnitID.HeartReward, ["game", "quiz"], {
      onRewarded: this.onRewarded
    });
    loadAD(AdmobUnitID.HeartScreen, ["game", "quiz"]);
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
    return (
      <Container>
        <Content>
          <ADButton onPress={this.requestHeartRewardAD}>
            <ButtonText>광고 보기(리워드)</ButtonText>
          </ADButton>
          <ADButton onPress={this.requestHeartScreenAD}>
            <ButtonText>광고 보기(전면)</ButtonText>
          </ADButton>
          <ADButton onPress={this.shareLink}>
            <ButtonText>
              링크 공유(스토어 등록되어야 정상적으로 동작함)
            </ButtonText>
          </ADButton>
          <ADButton
            onPress={() => SearchTrackScreen.open({ onResult: _.identity })}
          >
            <ButtonText>트랙 검색</ButtonText>
          </ADButton>
          {this.renderItemAll}
          <AudioPlayer />
        </Content>
      </Container>
    );
  }

  private get renderItemAll() {
    const { user } = this.props.authStore;
    return (
      <>
        <ButtonText>item All</ButtonText>
        {user?.userItemViews
          ? user?.userItemViews.map(item => {
              return (
                <React.Fragment key={item.itemType}>
                  <ButtonText>{item.itemType}</ButtonText>
                  <ButtonText>{item.count}</ButtonText>
                </React.Fragment>
              );
            })
          : null}
      </>
    );
  }

  private onRewarded = async () => {
    const { fetchUserInfo } = this.props.authStore;
    const { showToast } = this.props.toastStore;
    try {
      await rewardForWatchingAdUsingPOST(RewardType.AdMovie);
      await fetchUserInfo();
      showToast("보상 완료!");
    } catch (error) {
      showToast(error.message);
    }
  };

  private requestHeartRewardAD = () => {
    showAD(AdmobUnitID.HeartReward);
  };

  private requestHeartScreenAD = () => {
    showAD(AdmobUnitID.HeartScreen);
  };

  private shareLink = async () => {
    const { showToast } = this.props.toastStore;
    const { accessId } = this.props.authStore;
    const shortLink = await makeAppShareLink(accessId);
    Clipboard.setString(shortLink);
    showToast("공유 링크 복사 완료");
  };
}

export default MainScreen;
