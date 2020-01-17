import React from "react";
import styled from "styled-components/native";
import { ViewProps } from "react-native";

import { Bold12, Bold20, Bold36 } from "src/components/text/Typographies";
import OnlyConfirmPopup from "src/components/popup/OnlyConfirmPopup";
import MockButton from "../button/MockButton";

interface IProps {
  style?: ViewProps["style"];
  onConfirm: () => void;
  onChargeFullHeart: () => void;
  onCancel: () => void;
}

const PopupContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const PopupTitle = styled(Bold20)`
  margin-top: 33px;
  margin-bottom: 33px;
`;

const PopupDescription = styled(Bold12)`
  margin-bottom: 47px;
`;

const ChargeFullHeartButton = styled(MockButton)``;

function UseFullHeartPopup(props: IProps) {
  const { style, onConfirm, onCancel, onChargeFullHeart } = props;
  return (
    <OnlyConfirmPopup
      style={style}
      ContentComponent={
        <PopupContainer>
          <PopupTitle>하트 풀충전 아이템</PopupTitle>
          <PopupDescription>{`하트 갯수 만큼 게임을 할 수 있어요!`}</PopupDescription>
          <ChargeFullHeartButton
            name="광고보고 아이템받기 >"
            onPress={onChargeFullHeart}
          />
        </PopupContainer>
      }
      confirmText={"아이템 사용"}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

export default UseFullHeartPopup;
