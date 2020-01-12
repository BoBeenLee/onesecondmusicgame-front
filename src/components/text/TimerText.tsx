import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import OSMGText from "src/components/text/OSMGText";
import useTimer from "src/hooks/useTimer";

interface IProps {
  style?: ViewProps["style"];
  seconds: number;
  onTimeEnd: () => void;
}

const Container = styled(OSMGText)``;

function TimerText(props: IProps) {
  const { style, seconds, onTimeEnd } = props;
  const { timeLeft } = useTimer({ seconds, onTimeEnd });
  return <Container style={style}>{timeLeft}</Container>;
}

export default TimerText;
