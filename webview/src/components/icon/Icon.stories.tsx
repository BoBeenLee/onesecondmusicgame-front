import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";
import styled from "styled-components/native";

import HeartGroup from "src/components/icon/HeartGroup";
import colors from "src/styles/colors";
import CircleCheckGroup from "src/components/icon/CircleCheckGroup";
import SkipIcon from "src/components/icon/SkipIcon";

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

storiesOf("Icon", module)
  .addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
  .add("SkipIcon", () => {
    return <SkipIcon />;
  })
  .add("HeartGroup", () => {
    return <HeartGroup hearts={["active", "inactive"]} />;
  })
  .add("CircleCheckGroup", () => {
    return (
      <CircleCheckGroup
        circles={[
          {
            check: "o",
            active: false
          },
          {
            check: "x",
            active: false
          },
          {
            check: "correct",
            active: false
          }
        ]}
      />
    );
  });
