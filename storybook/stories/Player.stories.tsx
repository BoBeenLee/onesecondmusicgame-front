import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import MiniAudioPlayer from "src/components/player/MiniAudioPlayer";
import SiriAudioPlayer from "src/components/player/SiriAudioPlayer";
import GameAudioPlayer from "src/components/player/GameAudioPlayer";

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const MiniAudioPlayerView = styled(MiniAudioPlayer)``;

storiesOf("Player", module)
  .addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
  .add("MiniAudioPlayer", () => {
    return (
      <MiniAudioPlayerView
        size={50}
        source={{
          uri:
            "https://api.soundcloud.com/tracks/736765723/stream?client_id=a281614d7f34dc30b665dfcaa3ed7505"
        }}
        onToggle={action("onToggle")}
      />
    );
  })
  .add("SiriAudioPlayer", () => {
    return (
      <SiriAudioPlayer
        onToggle={action("onTogglePlay")}
        source={{
          uri:
            "https://api.soundcloud.com/tracks/736765723/stream?client_id=a281614d7f34dc30b665dfcaa3ed7505"
        }}
      />
    );
  })
  .add("GameAudioPlayer", () => {
    return (
      <GameAudioPlayer
        size={200}
        source={{
          uri:
            "https://api.soundcloud.com/tracks/736765723/stream?client_id=a281614d7f34dc30b665dfcaa3ed7505"
        }}
        highlight={0}
        onToggle={action("onToggle")}
      />
    );
  });
