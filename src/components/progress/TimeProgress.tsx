import _ from "lodash";
import React, { useRef, useEffect } from "react";
import { ViewProps, Animated } from "react-native";
import styled from "styled-components/native";

import useComponentSize from "src/hooks/useComponentSize";

interface IProps {
  style?: ViewProps["style"];
  activePercentage: number;
}

const Container = styled.View`
  width: 100%;
  height: 11px;
  background-color: #d8d8d8;
`;

const ActiveProgressBar = styled(Animated.View)`
  height: 11px;
  background-color: #b5b5b5;
`;

function TimeProgress(props: IProps) {
  const { style, activePercentage } = props;
  const { size, onLayout } = useComponentSize();
  const activeWidth = useRef(new Animated.Value(0));

  useEffect(() => {
    activeWidth.current?.setValue(
      _.round(size.width * (activePercentage * 0.01))
    );
  }, [size.width, activePercentage]);

  return (
    <Container style={style} onLayout={onLayout}>
      <ActiveProgressBar style={{ width: activeWidth.current }} />
    </Container>
  );
}

export default TimeProgress;
