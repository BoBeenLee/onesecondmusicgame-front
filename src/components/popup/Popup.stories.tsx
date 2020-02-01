import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import ConfirmPopup from "src/components/popup/ConfirmPopup";
import colors from "src/styles/colors";
import ChargeSkipItemPopup from "src/components/popup/ChargeSkipItemPopup";
import InviteFriendsPopup from "src/components/popup/InviteFriendsPopup";
import UseFullHeartPopup from "src/components/popup/UseFullHeartPopup";
import Heart from "src/stores/model/Heart";

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
  })
  .add("SkipItemPopup", () => {
    return (
      <ChargeSkipItemPopup
        onCancel={action("onCancel")}
        onConfirm={action("onConfirm")}
      />
    );
  })
  .add("InviteFriendsPopup", () => {
    return (
      <InviteFriendsPopup
        onCancel={action("onCancel")}
        onConfirm={action("onConfirm")}
      />
    );
  })
  .add("UseFullHeartPopup", () => {
    return (
      <UseFullHeartPopup
        heart={Heart.create({ heartCount: 3 })}
        onCancel={action("onCancel")}
        onConfirm={action("onConfirm")}
        onChargeFullHeart={action("onChargeFullHeart")}
      />
    );
  });
