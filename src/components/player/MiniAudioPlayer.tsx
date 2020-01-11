import _ from "lodash";
import React, { useState } from "react";
import { ViewProps } from "react-native";
import styled, { css } from "styled-components/native";
import Video, { VideoProperties } from "react-native-video";

import XEIcon, { XEIconType } from "src/components/icon/XEIcon";
import PlayButton from "src/components/button/PlayButton";

interface IProps extends VideoProperties {
  style?: ViewProps["style"];
  size: number;
}

const Container = styled.View<{ size: number }>`
  ${({ size }) => css`
    width: ${size}px;
    height: ${size}px;
  `}
`;

const AudioPlayer = styled(Video)``;

const AudioView = styled(PlayButton)``;

function MiniAudioPlayer(props: IProps) {
  const { style, size, onEnd, onLoadStart, ...rest } = props;
  const [playType, setPlayType] = useState<
    Extract<XEIconType, "play" | "stop">
  >("play");
  const onPlayerEnd = () => {
    setPlayType("stop");
    onEnd && onEnd();
  };
  const onPlayerStart = () => {
    setPlayType("play");
    onLoadStart && onLoadStart();
  };
  return (
    <Container size={size}>
      <AudioPlayer
        ignoreSilentSwitch={"ignore"}
        controls={false}
        onEnd={onPlayerEnd}
        onLoadStart={onPlayerStart}
        paused={playType === "stop"}
        {...rest}
      />
      <AudioView
        style={style}
        size={size}
        playType={playType}
        onPress={_.partial(setPlayType, playType === "play" ? "stop" : "play")}
      />
    </Container>
  );
}

export default MiniAudioPlayer;
