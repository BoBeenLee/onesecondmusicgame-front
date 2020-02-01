import React from "react";
import styled from "styled-components/native";
import { ViewProps } from "react-native";

import {
  Bold12,
  Bold15,
  Bold20,
  Bold24
} from "src/components/text/Typographies";
import OnlyConfirmPopup from "src/components/popup/OnlyConfirmPopup";
import colors from "src/styles/colors";
import XEIcon from "src/components/icon/XEIcon";

interface IProps {
  style?: ViewProps["style"];
  onConfirm: () => void;
  onCancel: () => void;
}

const OuterContainer = styled(OnlyConfirmPopup)``;

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

const PopupDescription = styled(Bold15)`
  text-align: center;
  color: ${colors.slateGrey};
  margin-bottom: 7px;
`;

const PopupHighlightDescription = styled(Bold15)`
  color: ${colors.lightMagentaThree};
`;

const ProcessView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 23px;
`;

const HeartIcon = styled(XEIcon)``;

const PlusIcon = styled(XEIcon)`
  margin-horizontal: 17px;
`;

const ArrowIcon = styled(XEIcon)`
  margin-horizontal: -7px;
`;

const Box = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 14px;
  border: solid 3px ${colors.lightBlueGrey};
  background-color: ${colors.paleLavender};
`;

function InviteFriendsPopup(props: IProps) {
  const { style, onConfirm, onCancel } = props;
  return (
    <OuterContainer
      style={style}
      ContentComponent={
        <PopupContainer>
          <PopupTitle>친구 초대하기</PopupTitle>
          <PopupDescription>
            친구를 초대하면{"\n"}
            <PopupHighlightDescription>
              하트 풀충전 + 스킵 아이템
            </PopupHighlightDescription>
            을{"\n"} 각각 1개씩 드려요!
          </PopupDescription>
          <ProcessView>
            <HeartIcon name="heart" size={60} color={colors.pinkyPurple} />
            <PlusIcon name="plus" size={26} color={colors.pinkyPurple} />
            <Box>
              <ArrowIcon
                name="angle-right"
                size={26}
                color={colors.pinkyPurpleThree}
              />
              <ArrowIcon
                name="angle-right"
                size={26}
                color={colors.pinkyPurpleThree}
              />
            </Box>
          </ProcessView>
        </PopupContainer>
      }
      confirmText={"초대하기"}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

export default InviteFriendsPopup;
