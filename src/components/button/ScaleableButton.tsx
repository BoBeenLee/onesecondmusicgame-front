import React from "react";
import {
  Animated,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewProps
} from "react-native";
import styled from "styled-components/native";

import useScale from "src/hooks/useScale";

interface IProps extends TouchableOpacityProps {
  style?: ViewProps["style"];
  children: React.ReactNode;
}

const Container = styled(Animated.createAnimatedComponent(TouchableOpacity))`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function ScaleableButton(props: IProps) {
  const { scale, onPressIn, onPressOut } = useScale();
  const { style, children, ...rest } = props;

  return (
    <Container
      activeOpacity={1}
      style={[style, { transform: [{ scale }] }]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      {...rest}
    >
      {children}
    </Container>
  );
}

export default ScaleableButton;
