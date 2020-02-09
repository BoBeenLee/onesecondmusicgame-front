import { storiesOf } from "@storybook/react";
import React from "react";
import styled from "styled-components/native";

import LevelBadge from "src/components/badge/LevelBadge";

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const LevelBadgeView = styled.View`
  margin-right: 10px;
`;

storiesOf("Badge", module)
  .addDecorator((getStory: any) => <Container>{getStory()}</Container>)
  .add("LevelBadge", () => (
    <>
      <LevelBadgeView>
        <LevelBadge level="SUPER HARD" />
      </LevelBadgeView>
      <LevelBadgeView>
        <LevelBadge level="HARD" />
      </LevelBadgeView>
      <LevelBadgeView>
        <LevelBadge level="MEDIUM" />
      </LevelBadgeView>
      <LevelBadgeView>
        <LevelBadge level="EASY" />
      </LevelBadgeView>
    </>
  ));
