import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";
import SafeAreaView from "react-native-safe-area-view";
import LinearGradient from "react-native-linear-gradient";

import colors from "src/styles/colors";
import { isAndroid } from "src/utils/device";

interface IProps {
  children?: React.ReactNode;
  style?: ViewProps["style"];
  statusBarColor?: string;
}

const SafeAreaContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${colors.darkBlueGrey};
`;

const AndroidContainer = styled.View`
  flex: 1;
  background-color: ${colors.darkBlueGrey};
`;

const Container = styled(LinearGradient).attrs({
  colors: [colors.darkIndigo, colors.almostBlack]
})`
  flex: 1;
`;

function ContainerWithStatusBar({
  children,
  statusBarColor = "white",
  style
}: IProps) {
  if (isAndroid()) {
    return (
      <AndroidContainer>
        <Container style={style}>{children}</Container>
      </AndroidContainer>
    );
  }
  return (
    <SafeAreaContainer>
      <Container style={style}>{children}</Container>
    </SafeAreaContainer>
  );
}

export default ContainerWithStatusBar;
