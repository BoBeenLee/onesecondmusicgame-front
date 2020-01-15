import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import HeartGroup from "src/components/icon/HeartGroup";
import colors from "src/styles/colors";

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

storiesOf("Icon", module)
  .addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
  .add("HeartGroup", () => {
    return <HeartGroup />;
  });
