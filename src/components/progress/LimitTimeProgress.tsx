import _ from "lodash";
import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import useTimer from "src/hooks/useTimer";
import { Bold12, Bold14 } from "src/components/text/Typographies";
import TimeProgress from "src/components/progress/TimeProgress";

interface IProps {
  style?: ViewProps["style"];
  key: string;
  seconds: number;
  onTimeEnd: () => void;
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TimeText = styled(Bold12)`
  padding-left: 11px;
`;

const HUNDRED_PERCENTAGE = 100;

function LimitTimeProgress(props: IProps) {
  const { style, seconds, onTimeEnd } = props;
  const { timeLeft } = useTimer({ seconds, onTimeEnd });

  return (
    <Container style={style}>
      <TimeProgress
        activePercentage={
          HUNDRED_PERCENTAGE -
          _.round((timeLeft / seconds) * HUNDRED_PERCENTAGE)
        }
      />
      <TimeText>{timeLeft}초</TimeText>
    </Container>
  );
}

export default LimitTimeProgress;
