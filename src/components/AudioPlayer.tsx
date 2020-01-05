import React, { Component } from "react";
import styled from "styled-components/native";
import Video from "react-native-video";

import { Bold12 } from "src/components/text/Typographies";

const Container = styled.View``;

const AudioView = styled(Video)`
  width: 200px;
  height: 200px;
  background-color: black;
`;

class AudioPlayer extends Component {
  public render() {
    return (
      <Container>
        <AudioView
          ignoreSilentSwitch={"ignore"}
          controls={true}
          source={{
            uri:
              "https://api.soundcloud.com/tracks/736765723/stream?client_id=a281614d7f34dc30b665dfcaa3ed7505"
          }}
        />
      </Container>
    );
  }
}

export default AudioPlayer;
