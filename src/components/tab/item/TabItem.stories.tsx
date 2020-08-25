import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import RankTabItem from "src/components/tab/item/RankTabItem";

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  margin: 10px;
`;

storiesOf("TabItem", module)
  .addDecorator((getStory: any) => <Container>{getStory()}</Container>)
  .add("with RankTabItem", () => (
    <RankTabItem
      title="월간 랭킹"
      active={true}
      onSelected={action("onSelected")}
    />
  ));
