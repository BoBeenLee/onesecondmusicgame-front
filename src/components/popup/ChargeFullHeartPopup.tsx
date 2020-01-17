import React from "react";
import styled from "styled-components/native";
import { ViewProps } from "react-native";

import { Bold12, Bold20, Bold36 } from "src/components/text/Typographies";
import OnlyConfirmPopup from "src/components/popup/OnlyConfirmPopup";

interface IProps {
  style?: ViewProps["style"];
  onConfirm: () => void;
  onCancel: () => void;
}

const PopupContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const PopupDescription = styled(Bold12)`
  margin-bottom: 47px;
`;

function ChargeFullHeartPopup(props: IProps) {
  const { style, onConfirm, onCancel } = props;
  return (
    <OnlyConfirmPopup
      style={style}
      ContentComponent={
        <PopupContainer>
          <PopupDescription>{`하트를 모두 사용했네요!
광고를 보고
하트 Full 충전 받으시겠어요?`}</PopupDescription>
        </PopupContainer>
      }
      confirmText={"광고보기"}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

export default ChargeFullHeartPopup;
