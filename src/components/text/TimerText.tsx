import _ from "lodash";
import React, { useState, useRef, useEffect } from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { Bold14 } from "src/components/text/Typographies";

interface IProps {
  style?: ViewProps["style"];
  seconds: number;
  onExpire: () => void;
}

const Container = styled(Bold14)``;

function TimerText(props: IProps) {
  const { style, onExpire } = props;
  const [seconds, setSeconds] = useState(props.seconds);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (seconds - 1 === 0) {
        onExpire();
      }
      setSeconds(seconds - 1);
    }, 1000);
    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onExpire]);

  return (
    <Container style={style}>{`${_.floor(seconds / 60)}분 ${seconds %
      60}초`}</Container>
  );
}

export default TimerText;
