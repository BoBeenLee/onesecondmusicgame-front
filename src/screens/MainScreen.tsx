import _ from "lodash";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Clipboard } from "react-native";
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
import XEIconButton from "src/components/button/XEIconButton";
import { makeAppShareLink } from "src/utils/dynamicLink";
import { AdmobUnitID, loadAD, showAD } from "src/configs/admob";
import { tracks, ITrackItem } from "src/apis/soundcloud/tracks";
import SearchTrackScreen from "src/screens/SearchTrackScreen";

interface IInject {
  authStore: IAuthStore;
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

const Logo = styled(Bold14)``;

const ADButton = styled.TouchableOpacity``;

const ButtonText = styled(Bold12)``;

@inject(
  ({ store }: { store: IStore }): IInject => ({
    authStore: store.authStore,
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
    loadAD(AdmobUnitID.HeartReward, ["foo", "bar"]);
  }

  public render() {
    return (
      <Container>
        <Content>
          <ADButton onPress={this.requestHeartRewardAD}>
            <ButtonText>광고 보기(리워드)</ButtonText>
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
          <Logo>Main</Logo>
          <AudioPlayer />
        </Content>
      </Container>
    );
  }

  private requestHeartRewardAD = () => {
    showAD(AdmobUnitID.HeartReward);
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
