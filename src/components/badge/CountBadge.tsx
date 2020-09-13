import React from "react";
import { ViewProps, TextProps } from "react-native";
import styled from "styled-components/native";

import { Bold16, Bold15 } from "src/components/text/Typographies";
import colors from "src/styles/colors";

interface IProps {
  style?: ViewProps["style"];
  TextComponent?: React.ElementType;
  count: number;
}

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

const CountBadge = (props: IProps) => {
  const { style, TextComponent = BadgeText, count } = props;
  return (
    <BadgeView style={style}>
      <TextComponent>{count}</TextComponent>
    </BadgeView>
  );
};

export default CountBadge;
