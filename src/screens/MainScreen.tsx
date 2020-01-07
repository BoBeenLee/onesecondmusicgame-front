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
import RegisterSongScreen from "src/screens/RegisterSongScreen";
import { ICodePushStore } from "src/stores/CodePushStore";
import { rewardForWatchingAdUsingPOST, RewardType } from "src/apis/reward";
import { ItemType } from "src/apis/item";

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

const ItemAllView = styled.View`
  padding: 15px;
  border: 1px solid black;
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
          <ADButton onPress={RegisterSongScreen.open}>
            <ButtonText>노래 등록</ButtonText>
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
      <ItemAllView>
        <ButtonText>item All</ButtonText>
        {user?.userItemViews
          ? user?.userItemViews.map(item => {
              return (
                <React.Fragment key={item.itemType}>
                  <ButtonText>{item.itemType}</ButtonText>
                  <ButtonText>{item.count}</ButtonText>
                  <ADButton onPress={_.partial(this.useItem, item.itemType)}>
                    <ButtonText style={{ color: "red" }}>
                      아이템 사용하기
                    </ButtonText>
                  </ADButton>
                </React.Fragment>
              );
            })
          : null}
      </ItemAllView>
    );
  }

  private onRewarded = async () => {
    const { updateUserInfo } = this.props.authStore;
    const { showToast } = this.props.toastStore;
    try {
      await rewardForWatchingAdUsingPOST(RewardType.AdMovie);
      await updateUserInfo(null);
      showToast("보상 완료!");
    } catch (error) {
      showToast(error.message);
    }
  };

  private useItem = (itemType: ItemType) => {
    this.props.authStore.user?.userItemsByItemType(itemType)?.useItemType();
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
