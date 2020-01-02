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
          controls={true}
          source={{
            uri:
              "https://soundcloud.com/xxxtension/jinsang-night-breeze-extended"
          }}
        />
      </Container>
    );
  }
}

export default AudioPlayer;
