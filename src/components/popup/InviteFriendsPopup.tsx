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

const PopupTitle = styled(Bold20)`
  margin-top: 33px;
  margin-bottom: 33px;
`;

const PopupDescription = styled(Bold12)`
  margin-bottom: 47px;
`;

function InviteFriendsPopup(props: IProps) {
  const { style, onConfirm, onCancel } = props;
  return (
    <OnlyConfirmPopup
      style={style}
      ContentComponent={
        <PopupContainer>
          <PopupTitle>친구 초대하기</PopupTitle>
          <PopupDescription>{`친구를 초대하면 
하트 풀충전 + 스킵 아이템을 각각 1개씩 드려요!`}</PopupDescription>
        </PopupContainer>
      }
      confirmText={"초대하기"}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

export default InviteFriendsPopup;
