import _ from "lodash";
import React, { useState } from "react";
import { ViewProps } from "react-native";
import styled, { css } from "styled-components/native";
import Video, { VideoProperties } from "react-native-video";

import XEIcon, { XEIconType } from "src/components/icon/XEIcon";
import PlayButton from "src/components/button/PlayButton";
import { AudioType } from "src/components/player/interface";

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
  const [playType, setPlayType] = useState<Extract<XEIconType, AudioType>>(
    "play"
  );
  const onPlayerEnd = () => {
    setPlayType("play");
    onEnd && onEnd();
  };

  const onTogglePlayType = () => {
    setPlayType(playType === "play" ? "stop" : "play");
  };

  return (
    <Container style={style} size={size}>
      <AudioPlayer
        ignoreSilentSwitch={"ignore"}
        controls={false}
        onEnd={onPlayerEnd}
        onLoadStart={onLoadStart}
        paused={playType === "stop"}
        {...rest}
      />
      <AudioView size={size} playType={playType} onPress={onTogglePlayType} />
    </Container>
  );
}

export default MiniAudioPlayer;
