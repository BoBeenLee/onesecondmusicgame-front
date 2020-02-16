import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";
import styled from "styled-components/native";

import ConfirmPopup from "src/components/popup/ConfirmPopup";
import colors from "src/styles/colors";
import ChargeSkipItemPopup from "src/components/popup/ChargeSkipItemPopup";
import InviteFriendsPopup from "src/components/popup/InviteFriendsPopup";
import UseFullHeartPopup from "src/components/popup/UseFullHeartPopup";
import ChargeFullHeartPopup from "src/components/popup/ChargeFullHeartPopup";
import ExhaustFullHeartPopup from "src/components/popup/ExhaustFullHeartPopup";
import UserItemPopup from "src/components/popup/UserItemPopup";
import GainFullHeartPopup from "src/components/popup/GainFullHeartPopup";

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
        message="정말 그만두시겠어요?"
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
        count={5}
        onCancel={action("onCancel")}
        onInvite={action("onConfirm")}
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
  .add("ChargeFullHeartPopup", () => {
    return (
      <ChargeFullHeartPopup
        heart={{ heartCount: 3 } as any}
        onCancel={action("onCancel")}
        onChargeFullHeart={action("onChargeFullHeart")}
      />
    );
  })
  .add("UseFullHeartPopup", () => {
    return (
      <UseFullHeartPopup
        count={4}
        onCancel={action("onCancel")}
        onConfirm={action("onConfirm")}
        onAD={action("onChargeFullHeart")}
      />
    );
  })
  .add("ExhaustFullHeartPopup", () => {
    return (
      <ExhaustFullHeartPopup
        onInvite={action("onInvite")}
        onCancel={action("onCancel")}
      />
    );
  })
  .add("UserItemPopup", () => {
    return (
      <UserItemPopup
        skipCount={10}
        fullHeartCount={11}
        onInvite={action("onInvite")}
        onAD={action("onAD")}
        onUseFullHeart={action("onUseFullHeart")}
        onCancel={action("onCancel")}
      />
    );
  })
  .add("GainFullHeartPopup", () => {
    return (
      <GainFullHeartPopup heartCount={10} onConfirm={action("onConfirm")} />
    );
  });
