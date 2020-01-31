import _ from "lodash";
import React from "react";
import { TextStyle, ViewProps } from "react-native";
import styled from "styled-components/native";

import XEIconButton from "src/components/button/XEIconButton";
import { XEIconType } from "src/components/icon/XEIcon";
import { Bold15 } from "src/components/text/Typographies";
import colors from "src/styles/colors";

export const TOP_BAR_HEIGHT = 56;

export interface ITopBarProps {
  style?: ViewProps["style"];
  title?: string;
  titleStyle?: TextStyle;
  onBackPress: () => void;
  iconName: XEIconType;
  iconColor?: string;
  RightComponent?: JSX.Element;
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${TOP_BAR_HEIGHT}px;
  padding-horizontal: 16px;
`;

const IconButton = styled(XEIconButton)`
  position: absolute;
  left: 16px;
  padding: 2px;
`;

const Title = styled(Bold15)`
  color: ${colors.green550};
  letter-spacing: -0.5px;
`;

function FMTopBar({
  style: containerStyle,
  title,
  titleStyle,
  iconColor = colors.white,
  iconName,
  RightComponent,
  onBackPress
}: ITopBarProps) {
  return (
    <Container style={containerStyle}>
      {!_.isEmpty(title) && (
        <Title style={titleStyle} numberOfLines={1}>
          {title}
        </Title>
      )}
      <IconButton
        iconName={iconName}
        iconColor={iconColor}
        iconSize={24}
        onPress={onBackPress}
      />
      {RightComponent ? RightComponent : null}
    </Container>
  );
}

export default FMTopBar;
