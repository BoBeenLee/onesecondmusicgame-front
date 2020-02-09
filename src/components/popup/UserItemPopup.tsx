import React from "react";
import styled from "styled-components/native";
import { ViewProps } from "react-native";

import {
  Bold24,
  Bold15,
  Bold16,
  Bold17
} from "src/components/text/Typographies";
import OSMGPopup from "src/components/popup/OSMGPopup";
import colors from "src/styles/colors";
import SkipIcon from "src/components/icon/SkipIcon";
import XEIcon from "src/components/icon/XEIcon";
import images from "src/images";

interface IProps {
  style?: ViewProps["style"];
  skipCount: number;
  fullHeartCount: number;
  onInvite: () => void;
  onAD: () => void;
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
  margin-bottom: 26px;
`;

const StatusView = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ItemView = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-horizontal: 4px;
`;

const ItemTitle = styled(Bold16)`
  color: ${colors.slateGrey};
  margin-bottom: 8px;
`;

const BadgeView = styled.View`
  position: absolute;
  top: -5px;
  right: -5px;
  justify-content: center;
  align-items: center;
  width: 23px;
  height: 23px;
  background-color: ${colors.lightMagenta};
  border-radius: 11px;
`;

const BadgeText = styled(Bold15)`
  color: ${colors.white};
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

const SkipIconView = styled.View`
  width: 56px;
  height: 56px;
`;

const ItemButton = styled.TouchableOpacity`
  min-width: 130px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: solid 3px ${colors.lightMagentaThree};
  background-color: ${colors.pinkyPurple};
  padding-horizontal: 13px;
`;

const ItemButtonRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ItemButtonText = styled(Bold17)`
  color: ${colors.white};
  margin-right: 7px;
`;

const ArrowIcon = styled(XEIcon)``;

function UserItemPopup(props: IProps) {
  const {
    style,
    skipCount,
    fullHeartCount,
    onCancel,
    onInvite,
    onAD: onRewarded
  } = props;
  return (
    <OuterContainer
      style={style}
      ContentComponent={
        <PopupContainer>
          <PopupTitle>보유 아이템</PopupTitle>
          <StatusView>
            <ItemView>
              <SkipIconView>
                <SkipIcon />
                <BadgeView>
                  <BadgeText>{skipCount}</BadgeText>
                </BadgeView>
              </SkipIconView>
              <ItemTitle>SKIP</ItemTitle>
              <ItemButton onPress={onRewarded}>
                <ItemButtonRow>
                  <ItemButtonText>광고 보고</ItemButtonText>
                </ItemButtonRow>
                <ItemButtonRow>
                  <ItemButtonText>아이템 받기</ItemButtonText>
                  <ArrowIcon
                    name="angle-right"
                    size={15}
                    color={colors.white}
                  />
                </ItemButtonRow>
              </ItemButton>
            </ItemView>
            <ItemView>
              <HeartIconView>
                <HeartImage source={images.inviteHeart} />
                <BadgeView>
                  <BadgeText>{fullHeartCount}</BadgeText>
                </BadgeView>
              </HeartIconView>
              <ItemTitle>FULL</ItemTitle>
              <ItemButton onPress={onInvite}>
                <ItemButtonRow>
                  <ItemButtonText>친구 초대하고</ItemButtonText>
                </ItemButtonRow>
                <ItemButtonRow>
                  <ItemButtonText>아이템 받기</ItemButtonText>
                  <ArrowIcon
                    name="angle-right"
                    size={15}
                    color={colors.white}
                  />
                </ItemButtonRow>
              </ItemButton>
            </ItemView>
          </StatusView>
        </PopupContainer>
      }
      onCancel={onCancel}
    />
  );
}

export default UserItemPopup;
