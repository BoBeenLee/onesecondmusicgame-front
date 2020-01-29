import _ from "lodash";
import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";
import * as Progress from "react-native-progress";

import useComponentSize from "src/hooks/useComponentSize";

interface IProps {
  style?: ViewProps["style"];
  activePercentage: number;
}

const Container = styled.View`
  flex: 1;
  height: 11px;
  background-color: #d8d8d8;
`;

const ActiveProgressBar = styled(Progress.Bar)``;

function TimeProgress(props: IProps) {
  const { style, activePercentage } = props;
  const { size, onLayout } = useComponentSize();

  return (
    <Container style={style} onLayout={onLayout}>
      <ActiveProgressBar
        width={size.width}
        height={11}
        progress={activePercentage * 0.01}
      />
    </Container>
  );
}

export default TimeProgress;
