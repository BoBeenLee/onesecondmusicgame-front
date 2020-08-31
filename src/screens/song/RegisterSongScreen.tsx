import _ from "lodash";
import React, { Component } from "react";
import { Clipboard } from "react-native";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";

import { IStore } from "src/stores/Store";
import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold18 } from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { push, popTo, pop, getCurrentComponentId } from "src/utils/navigator";
import BackTopBar from "src/components/topbar/BackTopBar";
import colors from "src/styles/colors";
import { ITrackItem } from "src/apis/soundcloud/interface";
import { IToastStore } from "src/stores/ToastStore";
import { addNewSongUsingPOST } from "src/apis/song";
import ButtonLoading from "src/components/loading/ButtonLoading";
import Song, { ISong } from "src/stores/model/Song";

interface IInject {
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
  song: () => ISong;
}

interface IProps extends IInject, IParams {
  parentComponentId: string;
}

interface IStates {
  duration: number;
  highlightSeconds: number;
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
    const { componentId, song } = params;
    push({
      componentId,
      nextComponentId: SCREEN_IDS.RegisterSongScreen,
      params: {
        parentComponentId: params.componentId,
        song
      }
    });
  }

  public song: ISong = Song.create({
    artworkUrl: "",
    like: 0,
    singer: "",
    title: "",
    trackId: "",
    url: ""
  });

  constructor(props: IProps) {
    super(props);

    if (props.song) {
      this.song = props.song();
    }
    this.state = {
      duration: 0,
      highlightSeconds: 0
    };
  }

  public render() {
    const { duration } = this.state;
    const { title } = this.song;
    return (
      <Container>
        <BackTopBar title="노래 구간선택" onBackPress={this.back} />
        <Content>
          <SongTitle>{title}</SongTitle>
          <RegisterSongButtonText>
            duration: {_.round(duration)}seconds
          </RegisterSongButtonText>
        </Content>
        <Footer>{this.renderRegisterSongButton}</Footer>
      </Container>
    );
  }

  private get renderRegisterSongButton() {
    return (
      <RegisterSongButtonLoading>
        {({ loadingProps }) => {
          return (
            <RegisterSongButton
              onPress={
                loadingProps?.wrapperLoading?.(this.register) ?? this.register
              }
            >
              <RegisterSongButtonText>
                노래 구간 추가하기
              </RegisterSongButtonText>
            </RegisterSongButton>
          );
        }}
      </RegisterSongButtonLoading>
    );
  }

  private register = async () => {
    const { showToast } = this.props.toastStore;
    const { highlightSeconds } = this.state;
    const { title, url, singer } = this.song;

    if (![title, singer, url].some(value => !!value)) {
      return;
    }
    try {
      await addNewSongUsingPOST({
        singerName: singer,
        url: url ?? "",
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
