import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import LevelBadge from "src/components/badge/LevelBadge";

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

storiesOf("Badge", module)
  .addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
  .add("LevelBadge", () => {
    return <LevelBadge level="HARD" />;
  });
