import React, { useState, useEffect, useRef } from "react";
import { ViewProps } from "react-native";
import firebase from "react-native-firebase";
import styled from "styled-components/native";

import env from "src/configs/env";

interface IProps {
  style?: ViewProps["style"];
  keywords: string[];
}

const Banner = (firebase as any).admob.Banner;
const AdRequest = (firebase as any).admob.AdRequest;

const Container = styled(Banner)``;

const GameResultBanner = (props: IProps) => {
  const { style, keywords } = props;
  const [visible, setVisible] = useState(false);
  const request = useRef<any>(new AdRequest());

  useEffect(() => {
    for (const keyword of keywords) {
      request.current.addKeyword(keyword);
    }
    setVisible(true);
  }, []);

  const onClose = () => {
    setVisible(false);
  };

  if (!visible) {
    return null;
  }
  return (
    <Container
      style={style}
      unitId={env.buildAdEnv().GAME_RESULT}
      size={"SMART_BANNER"}
      request={request.current.build()}
      onAdClosed={onClose}
    />
  );
};

export default GameResultBanner;
