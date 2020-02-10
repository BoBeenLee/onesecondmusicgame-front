import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";
import styled from "styled-components/native";

import colors from "src/styles/colors";
import Tooltip from "src/components/tooltip/Tooltip";

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

storiesOf("Tooltip", module)
  .addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
  .add("Tooltip", () => {
    return (
      <Tooltip
        message="좋아하는 가수의 노래가 등록되어 있는지 확인할 수 있어요!"
        onPress={action("onPress")}
      />
    );
  });
