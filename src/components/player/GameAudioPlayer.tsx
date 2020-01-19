import _ from "lodash";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { ViewProps, InteractionManager } from "react-native";
import styled, { css } from "styled-components/native";
import Video, { VideoProperties } from "react-native-video";

import XEIcon, { XEIconType } from "src/components/icon/XEIcon";
import PlayButton from "src/components/button/PlayButton";
import { AudioType } from "src/components/player/interface";
import ScaleableButton from "src/components/button/ScaleableButton";
import { delay } from "src/utils/common";

interface IProps extends VideoProperties {
  style?: ViewProps["style"];
  size: number;
  highlightSeconds: number;
  onToggle?: (playType: AudioType) => void;
}

const Container = styled(ScaleableButton)<{ size: number }>`
  background-color: #d8d8d8;
  ${({ size }) => css`
    width: ${size}px;
    height: ${size}px;
    border-radius: ${_.round(size / 2)}px;
  `}
`;

const AudioPlayer = styled(Video)``;

const AudioView = styled(PlayButton)`
  background-color: #b7b7b7;
`;

function GameAudioPlayer(props: IProps) {
  const { style, size, onToggle, ...rest } = props;
  const [playType, setPlayType] = useState<Extract<XEIconType, AudioType>>(
    "stop"
  );
  const [loading, setLoading] = useState<{ audio: boolean }>({
    audio: true
  });
  const audioRef = useRef<Video>();

  useEffect(() => {
    audioRef.current?.seek(props.highlightSeconds);
  }, [props.highlightSeconds]);

  const stop = () => {
    setPlayType("stop");
    onToggle?.("stop");
    audioRef.current?.seek(props.highlightSeconds);
  };

  const onTogglePlayType = async (playType: AudioType) => {
    if (loading.audio) {
      return;
    }
    setPlayType(playType);
    onToggle?.(playType);
    await delay(2000);
    stop();
  };

  const onLoad = (data: { audio?: boolean }) => {
    setLoading(prevState => ({
      audio: data?.audio ?? prevState.audio
    }));
  };

  const revertPlayType = playType === "play" ? "stop" : "play";

  return (
    <Container
      style={style}
      size={size}
      onPress={_.partial(onTogglePlayType, revertPlayType)}
    >
      <AudioPlayer
        ref={audioRef as any}
        ignoreSilentSwitch={"ignore"}
        playInBackground={true}
        playWhenInactive={true}
        controls={false}
        onLoadStart={_.partial(onLoad, {
          audio: false
        })}
        paused={playType === "stop"}
        {...rest}
      />
      <AudioView
        disabled={true}
        size={size / 3}
        playType={revertPlayType}
        onPress={_.partial(onTogglePlayType, revertPlayType)}
      />
    </Container>
  );
}

export default GameAudioPlayer;
