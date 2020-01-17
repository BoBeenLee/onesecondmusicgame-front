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

function SkipItemPopup(props: IProps) {
  const { style, onConfirm, onCancel } = props;
  return (
    <OnlyConfirmPopup
      style={style}
      ContentComponent={
        <PopupContainer>
          <PopupTitle>스킵 아이템</PopupTitle>
          <PopupDescription>{`게임 중 모르는 노래를 skip하고
정답 처리받을 수 있어요!`}</PopupDescription>
        </PopupContainer>
      }
      confirmText={"친구초대하고 아이템받기 >"}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

export default SkipItemPopup;
