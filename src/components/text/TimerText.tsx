import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import useTimer from "src/hooks/useTimer";
import { Bold14 } from "src/components/text/Typographies";

interface IProps {
  style?: ViewProps["style"];
  seconds: number;
  onTimeEnd: () => void;
}

const Container = styled(Bold14)``;

function TimerText(props: IProps) {
  const { style, seconds, onTimeEnd } = props;
  const { timeLeft } = useTimer({ seconds, onTimeEnd });
  return <Container style={style}>{timeLeft}</Container>;
}

export default TimerText;
