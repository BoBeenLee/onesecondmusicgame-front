import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import SiriWebview from "src/components/webview/SiriWebview";

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

storiesOf("Webview", module)
  .addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
  .add("SiriWebview", () => {
    return (
      <>
        <SiriWebview width={100} height={50} type="play" />
        <SiriWebview width={100} height={50} type="play" />
      </>
    );
  });
