import _ from "lodash";
import React from "react";
import styled from "styled-components/native";
import { ViewProps } from "react-native";

import {
  Bold12,
  Bold15,
  Bold20,
  Bold24,
  Regular17
} from "src/components/text/Typographies";
import OnlyConfirmPopup from "src/components/popup/OnlyConfirmPopup";
import colors from "src/styles/colors";
import HeartGroup from "src/components/icon/HeartGroup";
import { IHeart } from "src/stores/model/Heart";
import XEIcon from "src/components/icon/XEIcon";

interface IProps {
  style?: ViewProps["style"];
  heart: IHeart;
  onConfirm: () => void;
  onChargeFullHeart: () => void;
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

const PopupDescription = styled(Bold15)`
  text-align: center;
  color: ${colors.slateGrey};
  margin-bottom: 7px;
`;

const HeartGroupView = styled(HeartGroup)`
  margin-top: 29px;
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

const ChargeFullHeartButtonText = styled(Regular17)`
  color: ${colors.purply};
`;

const ArrowIcon = styled(XEIcon)`
  margin-left: 6px;
`;

function UseFullHeartPopup(props: IProps) {
  const { style, heart, onConfirm, onCancel, onChargeFullHeart } = props;
  return (
    <OuterContainer
      style={style}
      ContentComponent={
        <PopupContainer>
          <PopupTitle>하트 풀충전 아이템</PopupTitle>
          <PopupDescription>{`하트 갯수 만큼 게임을 할 수 있어요!`}</PopupDescription>
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
      confirmText={"아이템 사용"}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

export default UseFullHeartPopup;
