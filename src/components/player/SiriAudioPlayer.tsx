import _ from "lodash";
import React, { useState } from "react";
import styled from "styled-components/native";
import { ViewProps } from "react-native";
import Video, { VideoProperties } from "react-native-video";

import SiriWebview from "src/components/webview/SiriWebview";
import { AudioType } from "src/components/player/interface";

interface IProps extends VideoProperties {
  style?: ViewProps["style"];
  onToggle: (playType: AudioType) => void;
}

const Container = styled.View``;

const AudioPlayer = styled(Video)``;

const Button = styled.Button``;

function SiriAudioPlayer(props: IProps) {
  const { style, onToggle, ...rest } = props;
  const [playType, setPlayType] = useState<AudioType>("stop");
  const [loading, setLoading] = useState<{ audio: boolean; siri: boolean }>({
    audio: true,
    siri: true
  });

  const onTogglePlayType = (playType: AudioType) => {
    if (loading.audio || loading.siri) {
      return;
    }
    setPlayType(playType);
    onToggle(playType);
  };

  const onLoad = (data: { audio?: boolean; siri?: boolean }) => {
    setLoading(prevState => ({
      audio: data?.audio ?? prevState.audio,
      siri: data?.siri ?? prevState.siri
    }));
  };

  const revertPlayType = playType === "play" ? "stop" : "play";

  return (
    <Container style={style}>
      <AudioPlayer
        ignoreSilentSwitch={"ignore"}
        controls={false}
        onEnd={_.partial(onTogglePlayType, "stop")}
        onLoadStart={_.partial(onLoad, {
          audio: false
        })}
        paused={playType === "stop"}
        {...rest}
      />
      <Button
        title={revertPlayType}
        onPress={_.partial(onTogglePlayType, revertPlayType)}
      />
      <SiriWebview
        width={80}
        height={80}
        type={playType}
        onLoadEnd={_.partial(onLoad, {
          siri: false
        })}
      />
    </Container>
  );
}

export default SiriAudioPlayer;
