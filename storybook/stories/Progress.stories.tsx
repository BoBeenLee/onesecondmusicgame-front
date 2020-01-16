import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import TimeProgress from "src/components/progress/TimeProgress";
import LimitTimeProgress from "src/components/progress/LimitTimeProgress";

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

storiesOf("Progress", module)
  .addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
  .add("TimeProgress", () => {
    return <TimeProgress activePercentage={60} />;
  })
  .add("LimitTimeProgress", () => {
    return <LimitTimeProgress seconds={60} onTimeEnd={action("onTimeEnd")} />;
  });
