import React, { useState, useEffect, useRef } from "react";
import { ViewProps } from "react-native";
import { BannerAd } from "@react-native-firebase/admob";

import styled from "styled-components/native";

import env from "src/configs/env";

interface IProps {
  style?: ViewProps["style"];
  keywords: string[];
}

const Container = styled(BannerAd)``;

const GameResultBanner = (props: IProps) => {
  const { style, keywords } = props;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
        keywords
      }}
      onAdClosed={onClose}
    />
  );
};

export default GameResultBanner;
