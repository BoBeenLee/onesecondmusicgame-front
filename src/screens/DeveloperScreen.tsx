import { getSnapshot } from "mobx-state-tree";
import iid from "@react-native-firebase/iid";
import _ from "lodash";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Clipboard, Alert } from "react-native";
import styled from "styled-components/native";
import Rate, { AndroidMarket } from "react-native-rate";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import {
  Bold12,
  Bold14,
  Bold18,
  Regular15,
  Medium15
} from "src/components/text/Typographies";
import { IStore } from "src/stores/Store";
import { IAuthStore } from "src/stores/AuthStore";
import { IToastStore } from "src/stores/ToastStore";
import { SCREEN_IDS } from "src/screens/constant";
import { pop, showStackModal, dismissAllModals } from "src/utils/navigator";
import colors from "src/styles/colors";
import ModalTopBar from "src/components/topbar/ModalTopBar";
import { makeAppShareLink } from "src/utils/dynamicLink";
import { AdmobUnitID, loadAD, AdmobUnit } from "src/configs/admob";
import {
  ICodePushStore,
  CODE_PUSH_KEY,
  INITIAL_CODE_PUSH_DATA
} from "src/stores/CodePushStore";
import { rewardForWatchingAdUsingPOST, RewardType } from "src/apis/reward";
import Singers, { ISingers } from "src/stores/Singers";
import { PopupProps } from "src/hocs/withPopup";
import { storage } from "src/utils/storage";
import { ILinkingStore } from "src/stores/LinkingStore";
import { IPushNotificationStore } from "src/stores/PushNotificationStore";
import { getBuildNumber, getVersion, getUniqueID } from "src/configs/device";

interface IInject {
  store: IStore;
  authStore: IAuthStore;
  codePushStore: ICodePushStore;
  linkingStore: ILinkingStore;
  pushNotificationStore: IPushNotificationStore;
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
}

interface IProps extends IInject, PopupProps {
  componentId: string;
}

interface IStates {
  storages: string;
  iid: string;
  storeSnapshot: string;
}

const Container = styled(ContainerWithStatusBar)`
  flex: 1;
  flex-direction: column;
`;

const Content = styled.ScrollView`
  flex: 1;
`;

const Title = styled(Bold18)`
  color: ${colors.white};
`;

const DevelopInfoText = styled(Regular15)`
  color: ${colors.white};
  margin-bottom: 8px;
`;

const ADButton = styled.TouchableOpacity``;

const ButtonText = styled(Bold12)`
  color: ${colors.white};
`;

@inject(
  ({ store }: { store: IStore }): IInject => ({
    store,
    authStore: store.authStore,
    codePushStore: store.codePushStore,
    linkingStore: store.linkingStore,
    pushNotificationStore: store.pushNotificationStore,
    toastStore: store.toastStore
  })
)
@observer
class DeveloperScreen extends Component<IProps, IStates> {
  public static open() {
    return showStackModal({
      componentId: SCREEN_IDS.DeveloperScreen
    });
  }

  public singers: ISingers = Singers.create();
  public admobUnit1: AdmobUnit;
  public admobUnit2: AdmobUnit;

  constructor(props: IProps) {
    super(props);

    this.state = {
      iid: "",
      storages: "",
      storeSnapshot: ""
    };
    this.admobUnit1 = loadAD(
      AdmobUnitID.HeartReward,
      ["game", "quiz", "music", "korea"],
      {
        onRewarded: this.onRewarded
      }
    );
    this.admobUnit2 = loadAD(AdmobUnitID.HeartScreen, ["game", "quiz"]);
  }

  public async componentDidMount() {
    this.fetchStoreSnapshot();
    this.fetchAllStorage();
    this.fetchIID();
    await this.singers.initialize({ q: "" });
  }

  public render() {
    const accessId = this.props.authStore?.user?.accessId ?? "";
    const { provider } = this.props.authStore;
    const { fcmToken } = this.props.pushNotificationStore;
    const { linkingURL } = this.props.linkingStore;
    const { codePushKey, currentCodePushData } = this.props.codePushStore;
    const deviceId = getUniqueID();
    const { storages, iid, storeSnapshot } = this.state;
    const versionAndBuildNumber = `${getVersion()} / ${getBuildNumber()}`;
    const accessIdAndProvier = `${accessId} / ${provider}`;
    const codePushAndBuildNumber = `${codePushKey} / ${currentCodePushData.codePushBuild}`;
    return (
      <Container>
        <ModalTopBar
          iconColor={colors.green500}
          title="개발자 모드"
          onBackPress={this.back}
        />
        <Content>
          <Title>version / buildNumber</Title>
          <DevelopInfoText
            onPress={_.partial(this.setContent, versionAndBuildNumber)}
          >
            {versionAndBuildNumber}
          </DevelopInfoText>
          <Title>codepush / codepushBuildNumber</Title>
          <DevelopInfoText
            onPress={_.partial(this.setContent, codePushAndBuildNumber)}
          >
            {codePushAndBuildNumber}
          </DevelopInfoText>
          <Title>firebase Instance ID</Title>
          <DevelopInfoText onPress={_.partial(this.setContent, iid)}>
            {iid}
          </DevelopInfoText>
          <Title>accessId / provider</Title>
          <DevelopInfoText
            onPress={_.partial(this.setContent, accessIdAndProvier)}
          >
            {accessIdAndProvier}
          </DevelopInfoText>
          <Title>deviceId</Title>
          <DevelopInfoText onPress={_.partial(this.setContent, deviceId || "")}>
            {deviceId || ""}
          </DevelopInfoText>
          <Title>fcmToken</Title>
          <DevelopInfoText onPress={_.partial(this.setContent, fcmToken || "")}>
            {fcmToken || ""}
          </DevelopInfoText>
          <Title>linkingURL</Title>
          <DevelopInfoText
            onPress={_.partial(this.setContent, linkingURL || "")}
          >
            {linkingURL || ""}
          </DevelopInfoText>
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
          <ADButton onPress={this.requestRate}>
            <ButtonText>별점 주기</ButtonText>
          </ADButton>
          <Title>asyncStorage</Title>
          <DevelopInfoText onPress={_.partial(this.setContent, storages)}>
            {storages}
          </DevelopInfoText>
          <Title>storeSnapshot</Title>
          <DevelopInfoText onPress={_.partial(this.setContent, storeSnapshot)}>
            Copy Stores
          </DevelopInfoText>
        </Content>
      </Container>
    );
  }

  private fetchStoreSnapshot = () => {
    const storeSnapshot = JSON.stringify(
      getSnapshot(this.props.store),
      undefined,
      2
    );
    this.setState({
      storeSnapshot
    });
  };

  private fetchAllStorage = async () => {
    const [
      doNotShowRegisterSongTooltip,
      doNotShowGamePlay,
      sharedAccessId,
      codePushData,
      token
    ] = await Promise.all([
      storage().getDoNotShowRegisterSongTooltip(),
      storage().getDoNotShowGamePlay(),
      storage().getSharedAccessId(),
      storage().getCodePushData(CODE_PUSH_KEY, INITIAL_CODE_PUSH_DATA),
      storage().getToken()
    ]);
    this.setState({
      storages: JSON.stringify({
        doNotShowRegisterSongTooltip,
        doNotShowGamePlay,
        sharedAccessId,
        codePushData,
        token
      })
    });
  };

  private fetchIID = async () => {
    const instanceId = await iid().get();
    this.setState({
      iid: instanceId
    });
  };

  private setContent = (content: string) => {
    const { showToast } = this.props.toastStore;
    Clipboard.setString(content);
    showToast("클립보드 복사 완료");
  };

  private onRewarded = async () => {
    const { updateUserReward } = this.props.authStore;
    const { showToast } = this.props.toastStore;
    try {
      await rewardForWatchingAdUsingPOST(RewardType.AdMovie);
      await updateUserReward();
      showToast("보상 완료!");
    } catch (error) {
      showToast(error.message);
    }
  };

  private requestHeartRewardAD = () => {
    this.admobUnit1.show();
  };

  private requestHeartScreenAD = () => {
    this.admobUnit2.show();
  };

  private shareLink = async () => {
    const { showToast } = this.props.toastStore;
    const { accessId } = this.props.authStore;
    const shortLink = await makeAppShareLink(accessId);
    Clipboard.setString(shortLink);
    showToast("공유 링크 복사 완료");
  };

  private requestRate = () => {
    const options = {
      AppleAppID: "1493107650",
      GooglePackageName: "kr.nexters.onesecondmusicgame",
      AmazonPackageName: "kr.nexters.onesecondmusicgame",
      OtherAndroidURL: "http://www.randomappstore.com/app/47172391",
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: false,
      openAppStoreIfInAppFails: true,
      fallbackPlatformURL: "http://www.mywebsite.com/myapp.html"
    };
    Rate.rate(options, success => {
      if (success) {
        Alert.alert("Success");
      }
    });
  };

  private back = () => {
    dismissAllModals();
  };
}

export default DeveloperScreen;
