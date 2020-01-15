import React, { Component } from "react";
import { ViewProps } from "react-native";
import styled, { css } from "styled-components/native";

import colors from "src/styles/colors";

export type CircleCheck = "active" | "inactive" | "check";

interface IProps {
  style?: ViewProps["style"];
  check: CircleCheck;
}

const Container = styled.View<{ check: CircleCheck }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  ${({ check }) => css`
    ${check === "active" &&
      css`
        background-color: ${colors.gray900};
      `}
    ${check === "inactive" &&
      css`
        background-color: ${colors.gray500};
      `}
    ${check === "check" &&
      css`
        background-color: transparent;
        border: 1px solid ${colors.gray900};
      `}
  `}
`;

const CircleCheckIcon = (props: IProps) => {
  const { check } = props;
  return <Container check={check} />;
};

export default CircleCheckIcon;
