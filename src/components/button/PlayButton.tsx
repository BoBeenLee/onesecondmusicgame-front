import _ from "lodash";
import React from "react";
import { ViewProps, TouchableOpacityProps } from "react-native";
import styled, { css } from "styled-components/native";

import XEIcon, { XEIconType } from "src/components/icon/XEIcon";
import ScaleableButton from "src/components/button/ScaleableButton";
import colors from "src/styles/colors";
import images from "src/images";
import zIndex from "src/styles/zIndex";

interface IProps extends TouchableOpacityProps {
  style?: ViewProps["style"];
  size: number;
  playType: Extract<XEIconType, "play" | "pause" | "stop">;
}

const Container = styled.View<{ size: number }>`
  justify-content: center;
  align-items: center;
  ${({ size }) => css`
    width: ${size}px;
    height: ${size}px;
    border-radius: ${_.round(size / 2)}px;
  `}
`;

const PlayIconButton = styled(ScaleableButton)`
  z-index: ${zIndex.middle};
  margin-left: 3px;
  margin-top: -3px;
`;

const PlayIcon = styled.Image<{ size: number }>`
  ${({ size }) => css`
    width: ${_.round(size * (70 / 213))}px;
    height: ${_.round(size * (70 / 213))}px;
  `}
`;

const CDBackground = styled.Image`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
`;

function PlayButton(props: IProps) {
  const { style, size, onPress, ...rest } = props;
  return (
    <Container style={style} size={size} {...rest}>
      <PlayIconButton onPress={onPress}>
        <PlayIcon size={size} source={images.playButton} />
      </PlayIconButton>
      <CDBackground source={images.playCD} />
    </Container>
  );
}

export default PlayButton;
