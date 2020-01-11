import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import PlayButton from "src/components/button/PlayButton";

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

storiesOf("Button", module)
  .addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
  .add("PlayButton", () => {
    return <PlayButton size={40} playType="play" onPress={action("onPress")} />;
  });
