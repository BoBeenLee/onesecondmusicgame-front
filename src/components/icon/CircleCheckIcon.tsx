/* eslint-disable react/display-name */
import _ from "lodash";
import React from "react";
import { ViewProps } from "react-native";
import styled, { css } from "styled-components/native";

import colors from "src/styles/colors";
import XEIcon from "src/components/icon/XEIcon";

export type CircleCheck = "o" | "x" | "?";

interface IProps {
  style?: ViewProps["style"];
  active: boolean;
  check: CircleCheck;
}

const DEFAULT_SIZE = 15;
const ACTIVE_SIZE = 19;

const CircleCheckByType: {
  [key in CircleCheck]: (size: number) => React.ReactNode;
} = {
  "?": size => (
    <XEIcon name="radiobox-blank" size={size} color={colors.pinkyPurple} />
  ),
  o: size =>
    size === ACTIVE_SIZE ? (
      <Current size={size} />
    ) : (
      <XEIcon name="radiobox-blank" size={size} color={colors.pinkyPurple} />
    ),
  x: size => <XEIcon name="close" size={size} color={colors.pinkyPurple} />
};

const Current = styled.View<{ size: number }>`
  border: solid 4px ${colors.purpleishPink};
  background-color: ${colors.robinEggBlue};
  ${({ size }) => css`
    width: ${size}px;
    height: ${size}px;
    border-radius: ${_.round(size / 2)}px;
  `}
`;

const Container = styled.View``;

function CircleCheckIcon(props: IProps) {
  const { style, active, check } = props;
  const currentSize = active ? ACTIVE_SIZE : DEFAULT_SIZE;
  const CircleCheckComponent = CircleCheckByType[check](currentSize);
  return <Container style={style}>{CircleCheckComponent}</Container>;
}

export default CircleCheckIcon;
