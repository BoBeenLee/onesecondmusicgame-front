import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import LevelBadge from "src/components/badge/LevelBadge";
import GameSingerBadge from "src/components/badge/GameSingerBadge";

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

storiesOf("Badge", module)
  .addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
  .add("LevelBadge", () => {
    return <LevelBadge level="HARD" />;
  })
  .add("GameSingerBadge", () => {
    return (
      <React.Fragment>
        <GameSingerBadge
          type="selected"
          name="랜덤"
          onClose={action("onClose")}
        />
        <GameSingerBadge type="unselected" name="랜덤" />
        <GameSingerBadge type="random" name="랜덤" />
      </React.Fragment>
    );
  });
