import _ from "lodash";
import React, { SFC } from "react";
import { TextStyle, ViewProps } from "react-native";
import styled from "styled-components/native";

import XEIconButton from "src/components/button/XEIconButton";
import { XEIconType } from "src/components/icon/XEIcon";
import { Bold15 } from "src/components/text/Typographies";
import colors from "src/styles/colors";

const TOP_BAR_HEIGHT = 56;

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

const FMTopBar: SFC<ITopBarProps> = ({
  style: containerStyle,
  title,
  titleStyle,
  iconColor = colors.gray900,
  iconName,
  RightComponent,
  onBackPress
}) => {
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
};

export { TOP_BAR_HEIGHT };
export default FMTopBar;
