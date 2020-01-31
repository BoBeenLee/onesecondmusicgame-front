import _ from "lodash";
import React, { useEffect } from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import useTimer from "src/hooks/useTimer";
import { Bold12, Bold14 } from "src/components/text/Typographies";
import TimeProgress from "src/components/progress/TimeProgress";
import colors from "src/styles/colors";

interface IProps {
  style?: ViewProps["style"];
  key: string;
  pause: boolean;
  seconds: number;
  onTimeEnd: () => void;
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
  const { style, seconds, pause, onTimeEnd } = props;
  const { timeLeft, stop, start } = useTimer({ seconds, onTimeEnd });

  useEffect(() => {
    if (pause) {
      stop();
      return;
    }
    start();
  }, [pause, start, stop]);

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
