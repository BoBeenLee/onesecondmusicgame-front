import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import PlayButton from "src/components/button/PlayButton";

storiesOf("Button", module).add("PlayButton", () => {
  return <PlayButton size={40} playType="play" />;
});
