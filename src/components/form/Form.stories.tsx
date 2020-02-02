import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import UserProfileForm from "src/components/form/UserProfileForm";

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-horizontal: 30px;
`;

storiesOf("Form", module)
  .addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
  .add("UserProfileForm", () => {
    return <UserProfileForm onConfirm={action("onConfirm") as any} />;
  });
