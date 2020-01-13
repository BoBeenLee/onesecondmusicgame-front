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
  const [playType, setPlayType] = useState<AudioType>("play");

  const onTogglePlayType = (playType: AudioType) => {
    setPlayType(playType);
    onToggle(playType);
  };
  const revertPlayType = playType === "play" ? "stop" : "play";

  return (
    <Container style={style}>
      <AudioPlayer
        ignoreSilentSwitch={"ignore"}
        controls={false}
        onEnd={_.partial(onTogglePlayType, "stop")}
        onLoadStart={_.partial(onTogglePlayType, "play")}
        paused={playType === "stop"}
        {...rest}
      />
      <Button
        title={revertPlayType}
        onPress={_.partial(onTogglePlayType, revertPlayType)}
      />
      <SiriWebview width={80} height={80} type={playType} />
    </Container>
  );
}

export default SiriAudioPlayer;
