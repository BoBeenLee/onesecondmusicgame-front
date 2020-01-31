import _ from "lodash";
import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";
import * as Progress from "react-native-progress";

import useComponentSize from "src/hooks/useComponentSize";
import colors from "src/styles/colors";

interface IProps {
  style?: ViewProps["style"];
  activePercentage: number;
}

const Container = styled.View`
  flex: 1;
  border-radius: 3px;
  /* background-color: ${colors.purpleyPink}; */
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
        color={colors.pinkyPurple}
        borderRadius={3}
        useNativeDriver={true}
      />
    </Container>
  );
}

export default TimeProgress;
