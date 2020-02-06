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
  margin-bottom: 26px;
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

const HeartImage = styled.Image`
  width: 52px;
  height: 48px;
  resize-mode: contain;
  margin-bottom: 6px;
`;

const StatusText = styled(Bold15)`
  color: ${colors.slateGrey};
  margin-top: 6px;
  margin-bottom: 20px;
`;

const ItemButton = styled.TouchableOpacity`
  width: 126px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: solid 2px ${colors.lightBlueGrey};
  background-color: ${colors.paleLavender};
  padding-horizontal: 13px;
`;

const ItemButtonRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ItemButtonText = styled(Bold17)`
  color: ${colors.purply};
  margin-right: 7px;
`;

const ArrowIcon = styled(XEIcon)``;

function UserItemPopup(props: IProps) {
  const { style, onCancel, onInvite, onAD: onRewarded } = props;
  return (
    <OuterContainer
      style={style}
      ContentComponent={
        <PopupContainer>
          <PopupTitle>보유 아이템</PopupTitle>
          <StatusView>
            <ItemView>
              <ItemTitle>SKIP</ItemTitle>
              <SkipIcon />
              <StatusText>5개</StatusText>
              <ItemButton onPress={onRewarded}>
                <ItemButtonRow>
                  <ItemButtonText>광고 보고</ItemButtonText>
                </ItemButtonRow>
                <ItemButtonRow>
                  <ItemButtonText>아이템 받기</ItemButtonText>
                  <ArrowIcon
                    name="angle-right"
                    size={15}
                    color={colors.purply}
                  />
                </ItemButtonRow>
              </ItemButton>
            </ItemView>
            <ItemView>
              <ItemTitle>FULL</ItemTitle>
              <HeartImage source={images.inviteHeart} />
              <StatusText>5개</StatusText>
              <ItemButton onPress={onInvite}>
                <ItemButtonRow>
                  <ItemButtonText>친구 초대하고</ItemButtonText>
                </ItemButtonRow>
                <ItemButtonRow>
                  <ItemButtonText>아이템 받기</ItemButtonText>
                  <ArrowIcon
                    name="angle-right"
                    size={15}
                    color={colors.purply}
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
