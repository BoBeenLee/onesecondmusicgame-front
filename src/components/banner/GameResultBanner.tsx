import React, { useState } from "react";
import { ViewProps } from "react-native";
import firebase from "react-native-firebase";
import styled from "styled-components/native";

import env from "src/configs/env";

interface IProps {
  style?: ViewProps["style"];
}

const Banner = (firebase as any).admob.Banner;
const AdRequest = (firebase as any).admob.AdRequest;
const request = new AdRequest();
request.addKeyword("foobar");

const Container = styled(Banner)``;

const GameResultBanner = (props: IProps) => {
  const { style } = props;
  const [visiable, setVisiable] = useState(true);

  const onClose = () => {
    setVisiable(false);
  };

  if (!visiable) {
    return null;
  }
  return (
    <Container
      style={style}
      unitId={env.buildAdEnv().GAME_RESULT}
      size={"SMART_BANNER"}
      request={request.build()}
      onAdClosed={onClose}
    />
  );
};

export default GameResultBanner;
