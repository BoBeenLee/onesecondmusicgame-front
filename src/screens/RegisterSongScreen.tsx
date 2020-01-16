import _ from "lodash";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";

import { IStore } from "src/stores/Store";
import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold18 } from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { push, pop } from "src/utils/navigator";
import BackTopBar from "src/components/topbar/BackTopBar";
import colors from "src/styles/colors";
import { ITrackItem } from "src/apis/soundcloud/interface";
import SearchTrackScreen from "src/screens/SearchTrackScreen";
import { IToastStore } from "src/stores/ToastStore";
import { addNewSongUsingPOST } from "src/apis/song";
import GameAudioPlayer from "src/components/player/GameAudioPlayer";
import { makePlayStreamUri } from "src/configs/soundCloudAPI";
import { OnLoadData } from "react-native-video";

interface IInject {
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
}

interface IProps extends IInject, IParams {
  selectedTrackItem?: ITrackItem;
}

interface IStates {
  selectedTrackItem: ITrackItem | null;
  duration: number;
}

const Container = styled(ContainerWithStatusBar)`
  flex: 1;
  flex-direction: column;
`;

const Content = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
`;

const SongTitle = styled(Bold18)``;

const GameSongPlayer = styled(GameAudioPlayer)`
  margin-top: 24px;
  margin-bottom: 20px;
`;

const RegisterSongDescription = styled(Bold12)`
  text-align: center;
`;

const Thumnail = styled.Image`
  width: 50px;
  height: 50px;
`;

const Footer = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
`;

const RegisterSongButton = styled.TouchableOpacity`
  width: 375px;
  justify-content: center;
  align-items: center;
  padding-vertical: 16px;
  background-color: #b3b3b3;
`;

const RegisterSongButtonText = styled(Bold12)``;

@inject(
  ({ store }: { store: IStore }): IInject => ({
    toastStore: store.toastStore
  })
)
@observer
class RegisterSongScreen extends Component<IProps, IStates> {
  public static open(params: IParams) {
    SearchTrackScreen.open({
      componentId: params.componentId,
      onResult: (selectedTrackItem: ITrackItem) => {
        push({
          componentId: params.componentId,
          nextComponentId: SCREEN_IDS.RegisterSongScreen,
          params: {
            selectedTrackItem
          }
        });
      }
    });
  }

  constructor(props: IProps) {
    super(props);

    this.state = {
      selectedTrackItem: props?.selectedTrackItem ?? null,
      duration: 0
    };
  }

  public render() {
    const { selectedTrackItem, duration } = this.state;
    return (
      <Container>
        <BackTopBar title="노래 등록" onBackPress={this.back} />
        <Content>
          <SongTitle>{selectedTrackItem?.title}</SongTitle>
          <GameSongPlayer
            size={200}
            source={{
              uri: makePlayStreamUri(selectedTrackItem?.stream_url ?? "")
            }}
            onLoad={this.onSongLoad}
          />
          <RegisterSongDescription>
            {`원하는 노래 구간을 지정해주세요!
미 지정 시, 랜덤으로 구간 지정됩니다.`}
          </RegisterSongDescription>
          <Thumnail
            source={{
              uri:
                selectedTrackItem?.artwork_url ??
                "https://via.placeholder.com/150"
            }}
          />
          <RegisterSongButtonText>
            singerName: {selectedTrackItem?.user?.username}
          </RegisterSongButtonText>
          <RegisterSongButtonText>
            duration: {_.round(duration)}seconds
          </RegisterSongButtonText>
        </Content>
        <Footer>
          <RegisterSongButton onPress={this.register}>
            <RegisterSongButtonText>1초 노래 등록하기</RegisterSongButtonText>
          </RegisterSongButton>
        </Footer>
      </Container>
    );
  }

  private onSongLoad = (data: OnLoadData) => {
    this.setState({
      duration: data.duration
    });
  };

  private register = async () => {
    const { showToast } = this.props.toastStore;
    const { selectedTrackItem } = this.state;
    const title = selectedTrackItem?.title;
    const singerName = selectedTrackItem?.user?.username;
    const url = selectedTrackItem?.stream_url;

    if (![title, singerName, url].some(value => !!value)) {
      return;
    }
    await addNewSongUsingPOST({
      title,
      singerName,
      url,
      highlightSeconds: [0]
    });
    showToast("노래가 등록 완료되었습니다!");
  };

  private back = () => {
    const { componentId } = this.props;
    pop(componentId);
  };
}

export default RegisterSongScreen;
