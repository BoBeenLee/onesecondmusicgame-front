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
  onPress: () => void;
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
  const { style, playType, size, onPress } = props;
  return (
    <Container style={style} size={size} onPress={onPress}>
      <PlayIcon name={playType} size={size * (2 / 3)} color={colors.white} />
    </Container>
  );
}

export default PlayButton;
