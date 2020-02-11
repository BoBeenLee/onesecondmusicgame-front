import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";
import styled from "styled-components/native";

import PlayButton from "src/components/button/PlayButton";
import FloatingButton from "src/components/button/FloatingButton";
import { Bold12 } from "src/components/text/Typographies";

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

storiesOf("Button", module)
  .addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
  .add("PlayButton", () => {
    return (
      <PlayButton size={213} playType="play" onPress={action("onPress")} />
    );
  })
  .add("FloatingButton", () => {
    return (
      <FloatingButton
        ButtonComponent={<Bold12>Hello World</Bold12>}
        ItemComponents={[
          <Bold12 key={"item1"}>1</Bold12>,
          <Bold12 key={"item2"}>2</Bold12>,
          <Bold12 key={"item3"}>3</Bold12>
        ]}
        onToggle={action("onToggle")}
      />
    );
  });
