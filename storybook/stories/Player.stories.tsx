import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import MiniAudioPlayer from "src/components/player/MiniAudioPlayer";

const MiniAudioPlayerView = styled(MiniAudioPlayer)``;

storiesOf("Player", module).add("MiniAudioPlayer", () => {
  return (
    <MiniAudioPlayerView
      size={50}
      source={{
        uri:
          "https://api.soundcloud.com/tracks/736765723/stream?client_id=a281614d7f34dc30b665dfcaa3ed7505"
      }}
    />
  );
});
