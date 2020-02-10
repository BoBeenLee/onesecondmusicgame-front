import React from "react";
import styled from "styled-components/native";
import { ViewProps } from "react-native";

import {
  Bold24,
  Bold15,
  Bold16,
  Bold17,
  Bold18,
  Bold20
} from "src/components/text/Typographies";
import OSMGPopup from "src/components/popup/OSMGPopup";
import colors from "src/styles/colors";
import images from "src/images";

interface IProps {
  style?: ViewProps["style"];
  heartCount: number;
  onConfirm: () => void;
}

const OuterContainer = styled(OSMGPopup)`
  width: 307px;
`;

const PopupContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const PopupTitle = styled(Bold24)`
  color: ${colors.dark};
  margin-top: 33px;
  margin-bottom: 26px;
`;

const PopupDescription = styled(Bold15)`
  text-align: center;
  color: ${colors.slateGrey};
`;

const HeartView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 24px;
`;

const HeartImage = styled.Image`
  width: 52px;
  height: 48px;
  resize-mode: contain;
`;

const HeartCount = styled(Bold18)`
  color: ${colors.slateGrey};
`;

const TotalHeartCount = styled(Bold18)`
  color: ${colors.slateGrey};
  text-align: center;
  margin-top: 17px;
  margin-bottom: 24px;
`;

const ConfirmButton = styled.TouchableOpacity`
  width: 174px;
  height: 56px;
  justify-content: center;
  align-items: center;
  border-radius: 14px;
  border: solid 3px ${colors.lightMagentaThree};
  background-color: ${colors.pinkyPurple};
`;

const ConfirmButtonText = styled(Bold20)`
  text-align: center;
  color: ${colors.lightGrey};
`;

function GainFullHeartPopup(props: IProps) {
  const { style, heartCount, onConfirm } = props;
  return (
    <OuterContainer
      style={style}
      ContentComponent={
        <PopupContainer>
          <PopupTitle>하트 풀 충전 획득</PopupTitle>
          <PopupDescription>
            하트 갯수 만큼 게임을 할 수 있어요!
          </PopupDescription>
          <HeartView>
            <HeartImage source={images.inviteHeart} />
            <HeartCount>+ 1</HeartCount>
          </HeartView>
          <TotalHeartCount>총 {heartCount}개 보유</TotalHeartCount>
          <ConfirmButton onPress={onConfirm}>
            <ConfirmButtonText>확인</ConfirmButtonText>
          </ConfirmButton>
        </PopupContainer>
      }
    />
  );
}

export default GainFullHeartPopup;
