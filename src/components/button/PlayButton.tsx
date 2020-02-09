import _ from "lodash";
import React, { useRef, useEffect, useCallback } from "react";
import { Animated, ViewProps, Easing } from "react-native";
import styled, { css } from "styled-components/native";

import XEIcon, { XEIconType } from "src/components/icon/XEIcon";
import ScaleableButton from "src/components/button/ScaleableButton";
import colors from "src/styles/colors";
import images from "src/images";
import zIndex from "src/styles/zIndex";

interface IProps extends ViewProps {
  style?: ViewProps["style"];
  size: number;
  playType: Extract<XEIconType, "play" | "pause" | "stop">;
  onPress?: () => Promise<void> | void;
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
`;

const PlayIcon = styled.Image<{ size: number }>`
  ${({ size }) => css`
    width: ${_.round(size * (70 / 213))}px;
    height: ${_.round(size * (70 / 213))}px;
  `}
`;

const CDBackground = styled(Animated.Image)`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
`;

function PlayButton(props: IProps) {
  const { style, size, playType, onPress, ...rest } = props;
  const spinValue = useRef(new Animated.Value(0));
  const loop = useRef<Animated.CompositeAnimation | null>(null);

  const loopRotate = useCallback(() => {
    loop.current = Animated.timing(spinValue.current, {
      duration: 2000,
      toValue: 1,
      easing: Easing.inOut(Easing.linear),
      useNativeDriver: true
    });
    loop.current.start(result => {
      if (result.finished) {
        spinValue.current.setValue(0);
        loopRotate();
      }
    });
  }, []);
  useEffect(() => {
    if (playType === "play") {
      loopRotate();
      return;
    }
    loop.current?.stop?.();
  }, [loopRotate, playType]);

  const spin = spinValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  });

  return (
    <Container style={style} size={size} {...rest}>
      <PlayIconButton onPress={onPress}>
        <PlayIcon size={size} source={images.playButton} />
      </PlayIconButton>
      <CDBackground
        style={{ transform: [{ rotate: spin }] }}
        source={images.playCD}
      />
    </Container>
  );
}

export default PlayButton;
