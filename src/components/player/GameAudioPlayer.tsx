/* eslint-disable @typescript-eslint/camelcase */
import _ from "lodash";
import React, { useState } from "react";
import { ViewProps, InteractionManager } from "react-native";
import styled, { css } from "styled-components/native";
import TrackPlayer from "react-native-track-player";

import XEIcon, { XEIconType } from "src/components/icon/XEIcon";
import PlayButton from "src/components/button/PlayButton";
import { AudioType } from "src/components/player/interface";
import { delay } from "src/utils/common";
import { IGamePlayHighlightItem } from "src/stores/GamePlayHighlights";
import { makePlayStreamUriByTrackId } from "src/configs/soundCloudAPI";

interface IProps {
  style?: ViewProps["style"];
  size: number;
  gamePlayItem: IGamePlayHighlightItem;
  onToggle?: (playType: AudioType) => void;
}

const AudioView = styled(PlayButton)`
  background-color: #b7b7b7;
`;

function GameAudioPlayer(props: IProps) {
  const { style, size, gamePlayItem, onToggle } = props;
  const [playType, setPlayType] = useState<Extract<XEIconType, AudioType>>(
    "stop"
  );

  const stop = async () => {
    setPlayType("stop");
    onToggle?.("stop");
    await TrackPlayer.pause();
    await TrackPlayer.reset();
  };

  const play = async () => {
    setPlayType("play");
    onToggle?.("play");
    const {
      id,
      title,
      trackId,
      singer,
      artworkUrl,
      millisecond
    } = gamePlayItem;
    await TrackPlayer.add({
      id: String(id ?? "none"),
      url: makePlayStreamUriByTrackId(String(trackId)),
      title: title ?? "title",
      artist: singer ?? "none",
      artwork: artworkUrl
    });
    await TrackPlayer.seekTo(_.round((millisecond ?? 0) / 1000));
    await TrackPlayer.play();
    await delay(2000);
    stop();
  };

  return (
    <AudioView
      style={style}
      disabled={true}
      size={size}
      playType={playType}
      onPress={playType === "play" ? _.identity : play}
    />
  );
}

export default GameAudioPlayer;
