/* eslint-disable react/display-name */
import React from "react";
import { ViewProps } from "react-native";
import styled, { css } from "styled-components/native";

import colors from "src/styles/colors";
import XEIcon from "src/components/icon/XEIcon";

export type CircleCheck = "o" | "x" | "correct";

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
  correct: size => (
    <XEIcon name="radiobox-blank" size={size} color={colors.darkIndigo} />
  ),
  o: size => (
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
  `}
`;

const Container = styled.View``;

function CircleCheckIcon(props: IProps) {
  const { style, active, check } = props;
  if (active) {
    return (
      <Container style={style}>
        <Current size={ACTIVE_SIZE} />
      </Container>
    );
  }
  const CircleCheckComponent = CircleCheckByType[check](DEFAULT_SIZE);
  return <Container style={style}>{CircleCheckComponent}</Container>;
}

export default CircleCheckIcon;
