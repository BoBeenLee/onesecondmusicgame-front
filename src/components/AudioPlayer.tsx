import React, { Component } from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";
import Video, { VideoProperties } from "react-native-video";

import { Bold12 } from "src/components/text/Typographies";

const AudioView = styled(Video)`
  width: 200px;
  height: 200px;
  background-color: black;
`;

function AudioPlayer(props: VideoProperties) {
  return <AudioView ignoreSilentSwitch={"ignore"} controls={true} {...props} />;
}

export default AudioPlayer;
