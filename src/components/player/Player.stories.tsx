import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import GameAudioPlayer from "src/components/player/GameAudioPlayer";

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

storiesOf("Player", module)
  .addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
  .add("GameAudioPlayer", () => {
    return (
      <GameAudioPlayer
        size={200}
        onPlay={action("onPlay")}
        onToggle={action("onToggle")}
      />
    );
  });
