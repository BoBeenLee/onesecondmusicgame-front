import { Item } from "__generate__/api";
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
import { push } from "src/utils/navigator";
import colors from "src/styles/colors";
import AudioPlayer from "src/components/AudioPlayer";
import { makeAppShareLink } from "src/utils/dynamicLink";
import { AdmobUnitID, loadAD, showAD } from "src/configs/admob";
import SearchTrackScreen from "src/screens/song/SearchTrackScreen";
import RegisterSongScreen from "src/screens/song/RegisterSongScreen";
import { ICodePushStore } from "src/stores/CodePushStore";
import { rewardForWatchingAdUsingPOST, RewardType } from "src/apis/reward";
import Singers, { ISingers } from "src/stores/Singers";
import GamePlayScreen from "src/screens/game/GamePlayScreen";
import GameModeScreen from "src/screens/game/GameModeScreen";
import SiriAudioPlayer from "src/components/player/SiriAudioPlayer";
import { IPopupProps } from "src/hocs/withPopup";

interface IInject {
  authStore: IAuthStore;
  codePushStore: ICodePushStore;
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
}

interface IProps extends IInject, IPopupProps {
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
class DeveloperScreen extends Component<IProps> {
  public static open(params: IParams) {
    return push({
      componentId: params.componentId,
      nextComponentId: SCREEN_IDS.DeveloperScreen
    });
  }
  public singers: ISingers = Singers.create();

  public async componentDidMount() {
    await this.singers.initialize({ q: "" });
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
    const { componentId } = this.props;
    const { user } = this.props.authStore;
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
            onPress={() =>
              SearchTrackScreen.open({ componentId, onResult: _.identity })
            }
          >
            <ButtonText>트랙 검색</ButtonText>
          </ADButton>
          <ADButton
            onPress={_.partial(RegisterSongScreen.open, { componentId })}
          >
            <ButtonText>노래 등록</ButtonText>
          </ADButton>
          {this.renderItemAll}
          <ADButton onPress={_.identity}>
            <ButtonText>하트 체크: {user?.heart.heartCount}</ButtonText>
          </ADButton>
          <ADButton onPress={user?.heart.useHeart}>
            <ButtonText>하트 사용</ButtonText>
          </ADButton>
          <SiriAudioPlayer
            onToggle={this.toggleSiriPlayer}
            source={{
              uri:
                "https://api.soundcloud.com/tracks/736765723/stream?client_id=a281614d7f34dc30b665dfcaa3ed7505"
            }}
          />
          <ADButton
            onPress={_.partial(GamePlayScreen.open, {
              componentId: componentId,
              heartCount: 0
            })}
          >
            <ButtonText>게임플레이</ButtonText>
          </ADButton>
          <ADButton
            onPress={_.partial(GameModeScreen.open, {
              componentId: componentId
            })}
          >
            <ButtonText>게임모드</ButtonText>
          </ADButton>
          <ADButton onPress={this.showPopup}>
            <ButtonText>확인 팝업</ButtonText>
          </ADButton>
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

  private toggleSiriPlayer = (__: any) => {
    // NOTHING
  };

  private onRewarded = async () => {
    const { updateUserReward } = this.props.authStore;
    const { showToast } = this.props.toastStore;
    try {
      await rewardForWatchingAdUsingPOST(RewardType.AdMovie);
      updateUserReward();
      showToast("보상 완료!");
    } catch (error) {
      showToast(error.message);
    }
  };

  private useItem = (itemType: Item.ItemTypeEnum) => {
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

  private showPopup = () => {
    // NOTHING
  };
}

export default DeveloperScreen;
