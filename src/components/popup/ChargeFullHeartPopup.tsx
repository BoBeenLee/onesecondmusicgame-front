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
import HeartGroup from "src/components/icon/HeartGroup";
import { IHeart } from "src/stores/model/Heart";
import XEIcon from "src/components/icon/XEIcon";

interface IProps {
  style?: ViewProps["style"];
  heart: IHeart;
  onChargeFullHeart: () => void;
  onCancel: () => void;
}

const OuterContainer = styled(OSMGPopup)`
  width: 307px;
`;

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

const HeartGroupView = styled(HeartGroup)`
  margin-top: 19px;
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

function ChargeFullHeartPopup(props: IProps) {
  const { style, heart, onChargeFullHeart, onCancel } = props;
  return (
    <OuterContainer
      style={style}
      ContentComponent={
        <PopupContainer>
          <PopupTitle>하트를 모두 소진했어요!</PopupTitle>
          <PopupDescription>
            광고 보고{" "}
            <PopupHighlightDescription>
              하트 풀충전 아이템
            </PopupHighlightDescription>
            을{"\n"}선물 받으세요!
          </PopupDescription>
          <HeartGroupView
            hearts={_.times(5, index =>
              index + 1 <= (heart.heartCount ?? 0) ? "active" : "inactive"
            )}
          />
          <ChargeFullHeartButton onPress={onChargeFullHeart}>
            <ChargeFullHeartButtonText>
              광고보고 아이템받기
            </ChargeFullHeartButtonText>
            <ArrowIcon name="angle-right" size={15} color={colors.purply} />
          </ChargeFullHeartButton>
        </PopupContainer>
      }
      onCancel={onCancel}
    />
  );
}

export default ChargeFullHeartPopup;
