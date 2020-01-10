import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import MiniAudioPlayer from "src/components/player/MiniAudioPlayer";

const MiniAudioPlayerView = styled(MiniAudioPlayer)`
  width: 50px;
  height: 50px;
`;

storiesOf("Player", module).add("MiniAudioPlayer", () => {
  return (
    <MiniAudioPlayerView
      ignoreSilentSwitch={"ignore"}
      controls={false}
      source={{
        uri:
          "https://api.soundcloud.com/tracks/736765723/stream?client_id=a281614d7f34dc30b665dfcaa3ed7505"
      }}
    />
  );
});
