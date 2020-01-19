import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import _ from "lodash";
import React from "react";
import styled from "styled-components/native";

import BackDrop from "src/components/backdrop/BackDrop";
import SingersSubmitBackDrop from "src/components/backdrop/SingersSubmitBackDrop";
import { Bold12 } from "src/components/text/Typographies";
import MockButton from "src/components/button/MockButton";

const Container = styled.View`
  flex: 1;
  background-color: #eee;
`;

const ScrollView = styled.ScrollView``;

const Height2000View = styled.View`
  height: 2000px;
  background-color: #eee;
`;

const BackDropView = styled(BackDrop)`
  padding-top: 20px;
`;

storiesOf("BackDrop", module)
  .add("with BackDrop", () => (
    <Container>
      <MockButton name="hello world" onPress={action("onPress")} />
      <BackDropView
        showHandleBar={true}
        backdropHeight={200}
        overlayOpacity={false}
        onLoad={action("onLoad")}
        onClose={action("onClose")}
      >
        <Bold12>Hello World</Bold12>
      </BackDropView>
    </Container>
  ))
  .add("with SingersSubmitBackDrop", () => (
    <Container>
      <ScrollView>
        <Height2000View />
      </ScrollView>
      <SingersSubmitBackDrop
        selectedSingers={[]}
        onSubmit={action("onSubmit")}
        onSelectedItem={action("onSelectedItem")}
      />
    </Container>
  ));
