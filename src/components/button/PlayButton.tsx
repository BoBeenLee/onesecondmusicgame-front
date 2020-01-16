import _ from "lodash";
import React from "react";
import { ViewProps, TouchableOpacityProps } from "react-native";
import styled, { css } from "styled-components/native";

import XEIcon, { XEIconType } from "src/components/icon/XEIcon";
import colors from "src/styles/colors";

interface IProps extends TouchableOpacityProps {
  style?: ViewProps["style"];
  size: number;
  playType: Extract<XEIconType, "play" | "pause" | "stop">;
}

const Container = styled.TouchableOpacity<{ size: number }>`
  justify-content: center;
  align-items: center;
  background-color: ${colors.red500};
  ${({ size }) => css`
    width: ${size}px;
    height: ${size}px;
    border-radius: ${_.round(size / 2)}px;
  `}
`;

const PlayIcon = styled(XEIcon)`
  margin-left: 2px;
`;

function PlayButton(props: IProps) {
  const { style, playType, size, onPress, ...rest } = props;
  return (
    <Container style={style} size={size} onPress={onPress} {...rest}>
      <PlayIcon name={playType} size={size * (2 / 3)} color={colors.white} />
    </Container>
  );
}

export default PlayButton;
