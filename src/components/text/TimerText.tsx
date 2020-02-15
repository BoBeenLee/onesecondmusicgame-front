import _ from "lodash";
import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { Bold14 } from "src/components/text/Typographies";

interface IProps {
  style?: ViewProps["style"];
  timeLeft: number;
}

const Container = styled(Bold14)``;

function TimerText(props: IProps) {
  const { style, timeLeft } = props;
  const minutes = _.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  return <Container style={style}>{`${minutes}:${seconds}`}</Container>;
}

export default TimerText;
