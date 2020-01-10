import _ from "lodash";
import React from "react";
import { ViewProps } from "react-native";
import styled, { css } from "styled-components/native";

import XEIcon, { XEIconType } from "src/components/icon/XEIcon";
import colors from "src/styles/colors";

interface IProps {
  style?: ViewProps["style"];
  size: number;
  playType: Extract<XEIconType, "play" | "pause" | "stop">;
}

const Container = styled.View<{ size: number }>`
  padding: 10px;
  justify-content: center;
  align-items: center;
  background-color: #ff3300;
  ${({ size }) => css`
    width: ${size}px;
    height: ${size}px;
    border-radius: ${_.round(size / 2)}px;
  `}
`;

const PlayIcon = styled(XEIcon)``;

function PlayButton(props: IProps) {
  const { style, playType, size } = props;
  return (
    <Container style={style} size={size}>
      <PlayIcon
        type={"basket" as XEIconType}
        size={size}
        color={colors.white}
      />
    </Container>
  );
}

export default PlayButton;
