import React from "react";
import { TouchableOpacityProps } from "react-native";
import styled from "styled-components/native";

import XEIcon, { XEIconType } from "src/components/icon/XEIcon";
import { getHitSlop } from "src/utils/view";

interface IProps extends TouchableOpacityProps {
  iconName: XEIconType;
  iconColor: string;
  iconSize: number;
}

const Container = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

const Icon = styled(XEIcon)``;

export default function XEIconButton({
  iconName,
  iconColor,
  iconSize,
  ...props
}: IProps) {
  return (
    <Container {...props} hitSlop={iconSize ? getHitSlop(iconSize) : undefined}>
      <Icon name={iconName} color={iconColor} size={iconSize} />
    </Container>
  );
}
