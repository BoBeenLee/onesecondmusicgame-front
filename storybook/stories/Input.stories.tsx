import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import SearchTextInput from "src/components/input/SearchTextInput";

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-horizontal: 30px;
`;

storiesOf("Input", module)
  .addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
  .add("SearchTextInput", () => {
    return <SearchTextInput onSearch={action("onSearch")} />;
  });
