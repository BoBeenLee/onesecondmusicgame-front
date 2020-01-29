import _ from "lodash";
import React, { Component } from "react";
import { Clipboard } from "react-native";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";
import { OnLoadData, OnSeekData } from "react-native-video";

import { IStore } from "src/stores/Store";
import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold18 } from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { push, popTo, pop, getCurrentComponentId } from "src/utils/navigator";
import BackTopBar from "src/components/topbar/BackTopBar";
import colors from "src/styles/colors";
import { ITrackItem } from "src/apis/soundcloud/interface";
import SearchTrackScreen from "src/screens/SearchTrackScreen";
import { IToastStore } from "src/stores/ToastStore";
import { addNewSongUsingPOST } from "src/apis/song";
import GameAudioPlayer from "src/components/player/GameAudioPlayer";
import { makePlayStreamUri } from "src/configs/soundCloudAPI";
import ButtonLoading from "src/components/loading/ButtonLoading";
import AudioPlayer from "src/components/AudioPlayer";
import MockButton from "src/components/button/MockButton";
import OSMGTextInput from "src/components/input/OSMGTextInput";

interface IInject {
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
}

interface IProps extends IInject, IParams {
  parentComponentId: string;
  selectedTrackItem?: ITrackItem;
}

interface IStates {
  selectedTrackItem: ITrackItem | null;
  duration: number;
  highlightSeconds: number;
  singerName: string;
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

const SingerTextInput = styled(OSMGTextInput)`
  margin-top: 20px;
  margin-bottom: 20px;
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

const RegisterSongButtonLoading = styled(ButtonLoading)``;

const RegisterSongButton = styled.TouchableOpacity`
  width: 375px;
  padding-vertical: 16px;
  justify-content: center;
  align-items: center;
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
          componentId: getCurrentComponentId(),
          nextComponentId: SCREEN_IDS.RegisterSongScreen,
          params: {
            parentComponentId: params.componentId,
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
      duration: 0,
      highlightSeconds: 0,
      singerName: props?.selectedTrackItem?.user?.username ?? ""
    };
  }

  public render() {
    const {
      selectedTrackItem,
      duration,
      highlightSeconds,
      singerName
    } = this.state;
    return (
      <Container>
        <BackTopBar title="노래 등록" onBackPress={this.back} />
        <Content>
          <SongTitle>{selectedTrackItem?.title}</SongTitle>
          <GameSongPlayer
            highlightSeconds={highlightSeconds}
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
          <SingerTextInput
            placeholder="가수이름 입력"
            onChangeText={this.onSingerNameChangeText}
            value={singerName}
          />
          <Thumnail
            source={{
              uri:
                selectedTrackItem?.artwork_url ??
                "https://via.placeholder.com/150"
            }}
          />
          <MockButton name={`copy stream uri`} onPress={this.copyUri} />
          <RegisterSongButtonText>
            duration: {_.round(duration)}seconds
          </RegisterSongButtonText>
          <AudioPlayer
            source={{
              uri: makePlayStreamUri(selectedTrackItem?.stream_url ?? "")
            }}
            onSeek={this.onSeek}
          />
        </Content>
        <Footer>{this.renderRegisterSongButton}</Footer>
      </Container>
    );
  }

  private get renderRegisterSongButton() {
    return (
      <RegisterSongButtonLoading>
        {({ wrapperLoading, isLoading }) => {
          return (
            <RegisterSongButton onPress={wrapperLoading(this.register)}>
              <RegisterSongButtonText>1초 노래 등록하기</RegisterSongButtonText>
            </RegisterSongButton>
          );
        }}
      </RegisterSongButtonLoading>
    );
  }

  private onSingerNameChangeText = (text: string) => {
    this.setState({ singerName: text });
  };

  private onSeek = (data: OnSeekData) => {
    this.setState({
      highlightSeconds: data.seekTime
    });
  };

  private onSongLoad = (data: OnLoadData) => {
    this.setState({
      duration: data.duration
    });
  };

  private copyUri = () => {
    const { selectedTrackItem } = this.state;
    Clipboard.setString(makePlayStreamUri(selectedTrackItem?.stream_url ?? ""));
  };

  private register = async () => {
    const { showToast } = this.props.toastStore;
    const { selectedTrackItem, highlightSeconds, singerName } = this.state;
    const title = selectedTrackItem?.title;
    const url = selectedTrackItem?.stream_url;

    if (![title, singerName, url].some(value => !!value)) {
      return;
    }
    try {
      await addNewSongUsingPOST({
        url,
        highlightSeconds: [highlightSeconds]
      });
      this.goHome();
      showToast("노래가 등록 완료되었습니다!");
    } catch (error) {
      showToast(error.message);
    }
  };

  private back = () => {
    const { componentId } = this.props;
    pop(componentId);
  };

  private goHome = () => {
    const { parentComponentId } = this.props;
    popTo(parentComponentId);
  };
}

export default RegisterSongScreen;
