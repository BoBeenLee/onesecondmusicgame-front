import _ from "lodash";
import React from "react";
import styled from "styled-components/native";
import { ViewProps } from "react-native";

import {
  Bold15,
  Bold24,
  Bold36,
  Regular17,
  Bold17
} from "src/components/text/Typographies";
import OSMGPopup from "src/components/popup/OSMGPopup";
import colors from "src/styles/colors";
import XEIcon from "src/components/icon/XEIcon";
import SkipIcon from "src/components/icon/SkipIcon";
import OSMGText from "src/components/text/OSMGText";
import images from "src/images";

interface IProps {
  style?: ViewProps["style"];
  onInvite: () => void;
  onCancel: () => void;
}

const PopupContainer = styled.View`
  flex-direction: column;
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

const HeartInfoView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 19px;
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

const ChargeFullHeartButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  height: 37px;
  border-radius: 8px;
  border: solid 2px ${colors.lightBlueGrey};
  background-color: ${colors.paleLavender};
  padding-horizontal: 13px;
  margin-top: 29px;
  margin-bottom: 20px;
`;

const ChargeFullHeartButtonText = styled(Bold17)`
  color: ${colors.purply};
`;

const ArrowIcon = styled(XEIcon)`
  margin-left: 6px;
`;

function ExhaustFullHeartPopup(props: IProps) {
  const { style, onInvite, onCancel } = props;
  return (
    <OSMGPopup
      style={style}
      ContentComponent={
        <PopupContainer>
          <PopupTitle>하트를 모두 소진했어요!</PopupTitle>
          <PopupDescription>
            친구를 초대하면{" "}
            <PopupHighlightDescription>
              하트 풀충전 + SKIP 아이템
            </PopupHighlightDescription>
            을{"\n"} 각각 1개씩 선물드려요!
          </PopupDescription>
          <HeartInfoView>
            <HeartImage source={images.inviteHeart} />
            <PlusText>+</PlusText>
            <SkipIcon />
          </HeartInfoView>
          <ChargeFullHeartButton onPress={onInvite}>
            <ChargeFullHeartButtonText>
              친구 초대하고 아이템 받기
            </ChargeFullHeartButtonText>
            <ArrowIcon name="angle-right" size={15} color={colors.purply} />
          </ChargeFullHeartButton>
        </PopupContainer>
      }
      onCancel={onCancel}
    />
  );
}

export default ExhaustFullHeartPopup;
