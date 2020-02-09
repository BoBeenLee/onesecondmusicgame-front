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
  onToggle?: (playType: AudioType) => void;
}

const Container = styled.View<{ size: number }>`
  ${({ size }) => css`
    width: ${size}px;
    height: ${size}px;
  `}
`;

const AudioView = styled(PlayButton)``;

function MiniAudioPlayer(props: IProps) {
  const { style, size, onToggle, ...rest } = props;
  const [playType, setPlayType] = useState<Extract<XEIconType, AudioType>>(
    "stop"
  );
  const [loading, setLoading] = useState<{ audio: boolean }>({
    audio: true
  });

  const onTogglePlayType = (playType: AudioType) => {
    if (loading.audio) {
      return;
    }
    setPlayType(playType);
    onToggle?.(playType);
  };

  const revertPlayType = playType === "play" ? "stop" : "play";

  return (
    <Container style={style} size={size}>
      <AudioView
        size={size}
        playType={revertPlayType}
        onPress={_.partial(onTogglePlayType, revertPlayType)}
      />
    </Container>
  );
}

export default MiniAudioPlayer;
