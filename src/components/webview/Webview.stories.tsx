import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Text = styled.Text``;

storiesOf("Webview", module)
  .addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
  .add("test", () => {
    return <Text>webview</Text>;
  });
