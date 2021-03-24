import React, { useState, useEffect, useRef } from "react";
import { Linking, ViewProps } from "react-native";
import styled from "styled-components/native";
import { Advertisement } from "__generate__/api";

import env from "src/configs/env";
import IconButton from "src/components/button/IconButton";
import AutoHeightImage from "src/components/image/AutoHeightImage";
import { getDeviceWidth } from "src/utils/device";

interface IProps {
  style?: ViewProps["style"];
  advertise: Advertisement;
}

const Container = styled.TouchableOpacity``;

const Icon = styled(AutoHeightImage)`
  width: 100%;
`;

const GameResultImageBanner = (props: IProps) => {
  const { style, advertise } = props;
  const { imageUrl, redirectUrl } = advertise;

  const navigateTo = () => {
    Linking.openURL(redirectUrl ?? "");
  };
  return (
    <Container style={style} onPress={navigateTo}>
      <Icon width={getDeviceWidth()} source={{ uri: imageUrl }} />
    </Container>
  );
};

export default GameResultImageBanner;
