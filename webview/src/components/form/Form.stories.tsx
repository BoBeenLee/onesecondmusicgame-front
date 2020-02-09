import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";
import styled from "styled-components/native";

import UserProfileForm from "src/components/form/UserProfileForm";

const CenterView = styled.View`
  flex: 1;
`;

storiesOf("Form", module)
  .addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
  .add("UserProfileForm", () => {
    return <UserProfileForm onConfirm={action("onConfirm") as any} />;
  });
