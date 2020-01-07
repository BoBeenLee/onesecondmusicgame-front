import React, { Component } from "react";
import styled from "styled-components/native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold14 } from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { showStackModal, dismissAllModals } from "src/utils/navigator";
import ModalTopBar from "src/components/topbar/ModalTopBar";
import colors from "src/styles/colors";
import { ITrackItem } from "src/apis/soundcloud/tracks";
import SearchTrackScreen from "src/screens/SearchTrackScreen";
import _ from "lodash";

interface IProps {
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
  justify-content: center;
  align-items: center;
`;

const Logo = styled(Bold14)``;

const ADButton = styled.TouchableOpacity``;

const ButtonText = styled(Bold12)``;

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
          <Logo>노래 등록</Logo>
          <ADButton
            onPress={_.partial(SearchTrackScreen.open, {
              onResult: this.onSelected
            })}
          >
            <ButtonText>트랙 검색</ButtonText>
          </ADButton>
          <ButtonText>title: {selectedTrackItem?.title}</ButtonText>
          <ButtonText>singerName: {selectedTrackItem?.title}</ButtonText>
        </Content>
      </Container>
    );
  }

  private onSelected = (trackItem: ITrackItem) => {
    this.setState({
      selectedTrackItem: trackItem
    });
  };

  private back = () => {
    dismissAllModals();
  };
}

export default RegisterSongScreen;
