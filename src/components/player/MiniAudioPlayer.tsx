import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";
import Video, { VideoProperties } from "react-native-video";

interface IProps extends VideoProperties {
  style?: ViewProps["style"];
}

const AudioView = styled(Video)``;

function MiniAudioPlayer(props: IProps) {
  const { style, ...rest } = props;
  return <AudioView style={style} {...rest} />;
}

export default MiniAudioPlayer;
