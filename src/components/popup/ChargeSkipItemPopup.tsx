import React from "react";
import styled from "styled-components/native";
import { ViewProps } from "react-native";

import {
  Bold12,
  Bold24,
  Bold15,
  Bold17
} from "src/components/text/Typographies";
import OSMGPopup from "src/components/popup/OSMGPopup";
import colors from "src/styles/colors";
import SkipIcon from "src/components/icon/SkipIcon";
import XEIcon from "src/components/icon/XEIcon";

interface IProps {
  style?: ViewProps["style"];
  onInvite: () => void;
  onCancel: () => void;
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
  margin-bottom: 5px;
`;

const PopupDescription = styled(Bold15)`
  color: ${colors.slateGrey};
  text-align: center;
  margin-bottom: 20px;
`;

const StatusView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 26px;
`;

const StatusText = styled(Bold15)`
  margin-left: 16px;
  color: ${colors.slateGrey};
`;

const InviteButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 37px;
  border-radius: 8px;
  border: solid 2px ${colors.lightBlueGrey};
  background-color: ${colors.paleLavender};
  padding-horizontal: 13px;
`;

const InviteButtonText = styled(Bold17)`
  color: ${colors.purply};
  margin-right: 7px;
`;

const ArrowIcon = styled(XEIcon)``;

function ChargeSkipItemPopup(props: IProps) {
  const { style, onCancel, onInvite } = props;
  return (
    <OuterContainer
      style={style}
      ContentComponent={
        <PopupContainer>
          <PopupTitle>SKIP 아이템</PopupTitle>
          <PopupDescription>
            게임 중 모르는 노래를 스킵하고{"\n"}
            정답 처리 받을 수 있어요!
          </PopupDescription>
          <StatusView>
            <SkipIcon />
            <StatusText>
              현재{"\n"}
              5개 보유
            </StatusText>
          </StatusView>
          <InviteButton onPress={onInvite}>
            <InviteButtonText>친구 초대하고 아이템 받기</InviteButtonText>
            <ArrowIcon name="angle-right" size={15} color={colors.purply} />
          </InviteButton>
        </PopupContainer>
      }
      onCancel={onCancel}
    />
  );
}

export default ChargeSkipItemPopup;
