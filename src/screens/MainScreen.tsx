import React, { Component } from "react";
import { Clipboard, Alert } from "react-native";
import styled from "styled-components/native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold14 } from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { setRoot } from "src/utils/navigator";
import colors from "src/styles/colors";
import AudioPlayer from "src/components/AudioPlayer";
import XEIconButton from "src/components/button/XEIconButton";
import { makeAppShareLink } from "src/utils/dynamicLink";

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

class MainScreen extends Component {
  public static open() {
    setRoot({
      nextComponentId: SCREEN_IDS.MainScreen
    });
  }

  public render() {
    return (
      <Container>
        <Content>
          <XEIconButton
            iconName="alarm-o"
            iconColor={colors.gray900}
            iconSize={20}
            onPress={this.shareLink}
          />
          <Logo>Main</Logo>
          <AudioPlayer />
        </Content>
      </Container>
    );
  }

  private shareLink = async () => {
    const shortLink = await makeAppShareLink("test");
    Alert.alert(shortLink);
    Clipboard.setString(shortLink);
  };
}

export default MainScreen;
