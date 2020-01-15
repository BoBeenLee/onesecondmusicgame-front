import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import ConfirmPopup from "src/components/popup/ConfirmPopup";
import colors from "src/styles/colors";

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

storiesOf("Popup", module)
  .addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
  .add("ConfirmPopup", () => {
    return (
      <ConfirmPopup
        message="tedsfsdsdfsst"
        cancelText="취소"
        onCancel={action("onCancel")}
        confirmText="확인"
        onConfirm={action("onConfirm")}
      />
    );
  });
