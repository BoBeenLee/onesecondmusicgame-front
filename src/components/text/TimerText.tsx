import _ from "lodash";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { Bold14 } from "src/components/text/Typographies";

interface IProps {
  style?: ViewProps["style"];
  seconds: number;
  onExpire: () => void;
}

const Container = styled(Bold14)``;

const ONE_SECONDS = 1000;

function TimerText(props: IProps) {
  const { style, onExpire } = props;
  const [prevSeconds, setPrevSeconds] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(props.seconds);
  const intervalRef = useRef<any>(null);

  if (prevSeconds === null || prevSeconds !== props.seconds) {
    setPrevSeconds(props.seconds);
    setSeconds(props.seconds);
  }

  const useSeconds = useCallback(() => {
    if (seconds === 0) {
      onExpire();
      return;
    }
    setSeconds(seconds - 1);
  }, [onExpire, seconds]);

  useEffect(() => {
    intervalRef.current = setInterval(useSeconds, ONE_SECONDS);
    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, [props.onExpire, useSeconds]);

  return (
    <Container style={style}>{`${_.floor(seconds / 60)}분 ${seconds %
      60}초`}</Container>
  );
}

export default TimerText;
