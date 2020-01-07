import _ from "lodash";
import React, { Component } from "react";
import styled from "styled-components/native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold14 } from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { showStackModal, dismissAllModals } from "src/utils/navigator";
import ModalTopBar from "src/components/topbar/ModalTopBar";
import colors from "src/styles/colors";
import { ITrackItem } from "src/apis/soundcloud/interface";
import SearchTrackScreen from "src/screens/SearchTrackScreen";
import { songControllerApi } from "src/apis/song";
import { IToastStore } from "src/stores/ToastStore";

interface IInject {
  toastStore: IToastStore;
}

interface IProps extends IInject {
  componentId: string;
}

interface IStates {
  selectedTrackItem: ITrackItem | null;
}

const Container = styled(ContainerWithStatusBar)`
  flex: 1;
  flex-direction: column;
`;

const Content = styled.View`
  flex: 1;
  align-items: center;
`;

const Logo = styled(Bold14)``;

const Thumnail = styled.Image`
  width: 50px;
  height: 50px;
`;

const ADButton = styled.TouchableOpacity``;

const ButtonText = styled(Bold12)``;

@inject(
  ({ store }: { store: IStore }): IInject => ({
    toastStore: store.toastStore
  })
)
@observer
class RegisterSongScreen extends Component<IProps, IStates> {
  public static open() {
    return showStackModal(SCREEN_IDS.RegisterSongScreen);
  }

  constructor(props: IProps) {
    super(props);

    this.state = {
      selectedTrackItem: null
    };
  }

  public render() {
    const { selectedTrackItem } = this.state;
    return (
      <Container>
        <ModalTopBar title="노래 등록" onBackPress={this.back} />
        <Content>
          <ADButton
            onPress={_.partial(SearchTrackScreen.open, {
              onResult: this.onSelected
            })}
          >
            <ButtonText>트랙 검색</ButtonText>
          </ADButton>
          <Thumnail
            source={{
              uri:
                selectedTrackItem?.artwork_url ??
                "https://via.placeholder.com/150"
            }}
          />
          <ButtonText>title: {selectedTrackItem?.title}</ButtonText>
          <ButtonText>
            singerName: {selectedTrackItem?.user?.username}
          </ButtonText>
          <ButtonText>url: {selectedTrackItem?.stream_url}</ButtonText>
          <ADButton onPress={this.register}>
            <ButtonText style={{ color: "red" }}>register song</ButtonText>
          </ADButton>
        </Content>
      </Container>
    );
  }

  private onSelected = (trackItem: ITrackItem) => {
    this.setState({
      selectedTrackItem: trackItem
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
    await songControllerApi.addNewSongUsingPOST({
      title,
      singerName,
      url,
      highlightSeconds: [0]
    });
    showToast("등록 완료!");
  };

  private back = () => {
    dismissAllModals();
  };
}

export default RegisterSongScreen;
