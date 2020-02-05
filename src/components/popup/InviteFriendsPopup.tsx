import React from "react";
import styled from "styled-components/native";
import { ViewProps } from "react-native";

import { Bold15, Bold24 } from "src/components/text/Typographies";
import OnlyConfirmPopup from "src/components/popup/OnlyConfirmPopup";
import colors from "src/styles/colors";
import SkipIcon from "src/components/icon/SkipIcon";
import OSMGText from "src/components/text/OSMGText";
import images from "src/images";

interface IProps {
  style?: ViewProps["style"];
  onConfirm: () => void;
  onCancel: () => void;
}

const OuterContainer = styled(OnlyConfirmPopup)`
  width: 307px;
`;

const PopupContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const PopupTitle = styled(Bold24)`
  text-align: center;
  color: ${colors.dark};
  margin-top: 48px;
  margin-bottom: 5px;
`;

const PopupDescriptionGroup = styled.View`
  margin-bottom: 7px;
`;

const PopupDescriptionRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const PopupDescription = styled(Bold15)`
  text-align: center;
  color: ${colors.slateGrey};
`;

const PopupHighlightDescription = styled(Bold15)`
  color: ${colors.lightMagentaThree};
`;

const ProcessView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 23px;
`;

const HeartImage = styled.Image`
  width: 52px;
  height: 48px;
  resize-mode: contain;
`;

const PlusText = styled(OSMGText)`
  font-size: 36px;
  color: ${colors.slateGrey};
  margin-left: 21px;
  margin-right: 17px;
`;

function InviteFriendsPopup(props: IProps) {
  const { style, onConfirm, onCancel } = props;
  return (
    <OuterContainer
      style={style}
      ContentComponent={
        <PopupContainer>
          <PopupTitle>친구 초대하기</PopupTitle>
          <PopupDescriptionGroup>
            <PopupDescription>친구를 초대하면</PopupDescription>
            <PopupDescriptionRow>
              <PopupHighlightDescription>
                하트 풀충전 + SKIP 아이템
              </PopupHighlightDescription>
              <PopupDescription>을</PopupDescription>
            </PopupDescriptionRow>
            <PopupDescription>각각 1개씩 드려요!</PopupDescription>
          </PopupDescriptionGroup>
          <ProcessView>
            <HeartImage source={images.inviteHeart} />
            <PlusText>+</PlusText>
            <SkipIcon />
          </ProcessView>
        </PopupContainer>
      }
      confirmText={"친구 초대하기"}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

export default InviteFriendsPopup;
