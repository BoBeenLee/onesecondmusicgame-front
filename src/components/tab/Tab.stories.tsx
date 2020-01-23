import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import TransparentTabView, {
  IRoute
} from "src/components/tab/TransparentTabView";

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  margin: 10px;
`;

const AView = styled.View`
  flex: 1;
  background-color: red;
`;

const BView = styled.View`
  flex: 1;
  background-color: yellow;
`;

const renderA = () => {
  return <AView />;
};

const renderB = () => {
  return <BView />;
};

const routes: IRoute[] = [
  {
    key: "a",
    renderRoute: renderA
  },
  {
    key: "b",
    renderRoute: renderB
  }
];

storiesOf("Tab", module)
  .addDecorator((getStory: any) => <Container>{getStory()}</Container>)
  .add("with TransparentTabView", () => (
    <TransparentTabView tabIndex={0} routes={routes} />
  ));
