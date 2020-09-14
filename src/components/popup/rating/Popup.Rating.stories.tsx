import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import FeedbackRatingPopup from "src/components/popup/rating/FeedbackRatingPopup";
import ThanksRatingCompletePopup from "src/components/popup/rating/ThanksRatingCompletePopup";
import UserRatingConfirmPopup from "src/components/popup/rating/UserRatingConfirmPopup";

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

storiesOf("Popup/Rating", module)
  .addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
  .add("FeedbackRatingPopup", () => {
    return (
      <FeedbackRatingPopup
        onCancel={action("onCancel")}
        onConfirm={action("onConfirm")}
      />
    );
  })
  .add("ThanksRatingCompletePopup", () => {
    return <ThanksRatingCompletePopup onConfirm={action("onConfirm")} />;
  })
  .add("UserRatingConfirmPopup", () => {
    return (
      <UserRatingConfirmPopup
        nickname="test"
        onCancel={action("onCancel")}
        onConfirm={action("onConfirm")}
      />
    );
  });
