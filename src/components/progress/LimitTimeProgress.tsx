import _ from "lodash";
import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { Bold12, Bold14 } from "src/components/text/Typographies";
import TimeProgress from "src/components/progress/TimeProgress";
import colors from "src/styles/colors";

interface IProps {
  style?: ViewProps["style"];
  key: string;
  totalSeconds: number;
  seconds: number;
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TimeText = styled(Bold14)`
  padding-left: 11px;
  color: ${colors.paleGrey};
`;

const HUNDRED_PERCENTAGE = 100;

function LimitTimeProgress(props: IProps) {
  const { style, seconds, totalSeconds } = props;

  return (
    <Container style={style}>
      <TimeProgress
        activePercentage={
          HUNDRED_PERCENTAGE -
          _.round((seconds / totalSeconds) * HUNDRED_PERCENTAGE)
        }
      />
      <TimeText>{seconds}초</TimeText>
    </Container>
  );
}

export default LimitTimeProgress;
