import _ from "lodash";
import React from "react";
import styled from "styled-components/native";
import { ViewProps } from "react-native";

import {
  Bold12,
  Bold15,
  Bold20,
  Bold24,
  Regular17,
  Regular24
} from "src/components/text/Typographies";
import OnlyConfirmPopup from "src/components/popup/OnlyConfirmPopup";
import colors from "src/styles/colors";
import CountBadge from "src/components/badge/CountBadge";
import XEIcon from "src/components/icon/XEIcon";
import images from "src/images";

interface IProps {
  style?: ViewProps["style"];
  count: number;
  onConfirm: () => void;
  onAD: () => void;
  onCancel: () => void;
}

const OuterContainer = styled(OnlyConfirmPopup)`
  width: 307px;
`;

const PopupContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const PopupTitleHightlight = styled(Bold24)`
  text-align: center;
  color: ${colors.dark};
  margin-top: 48px;
  margin-bottom: 5px;
`;

const PopupTitle = styled(Regular24)`
  text-align: center;
  color: ${colors.dark};
  margin-top: 48px;
  margin-bottom: 5px;
`;

const PopupDescription = styled(Bold15)`
  text-align: center;
  color: ${colors.slateGrey};
  margin-top: 14px;
  margin-bottom: 22px;
`;

const HeartIconView = styled.View`
  width: 52px;
  height: 48px;
  margin-bottom: 6px;
`;

const HeartImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: contain;
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
  const { style, count, onConfirm, onCancel, onAD } = props;
  return (
    <OuterContainer
      style={style}
      ContentComponent={
        <PopupContainer>
          <PopupTitle>
            <PopupTitleHightlight>하트 풀충전</PopupTitleHightlight>
            {` 아이템`}
          </PopupTitle>
          <PopupDescription>{`5개의 하트 중 소진한 하트를
모두 충전할 수 있어요!`}</PopupDescription>
          <HeartIconView>
            <HeartImage source={images.inviteHeart} />
            {count ? <CountBadge count={count} /> : null}
          </HeartIconView>
          <ChargeFullHeartButton onPress={onAD}>
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
