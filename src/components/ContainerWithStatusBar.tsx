import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";
import SafeAreaView from "react-native-safe-area-view";

import colors from "src/styles/colors";
import LinearGradient from "react-native-linear-gradient";

interface IProps {
  children?: React.ReactNode;
  style?: ViewProps["style"];
  statusBarColor?: string;
}

const SafeAreaContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${colors.darkBlueGrey};
`;

const Container = styled(LinearGradient).attrs({
  colors: [colors.darkIndigo, colors.almostBlack]
})`
  flex: 1;
  background-color: ${colors.white};
`;

function ContainerWithStatusBar({
  children,
  statusBarColor = "white",
  style
}: IProps) {
  return (
    <SafeAreaContainer>
      <Container style={style}>{children}</Container>
    </SafeAreaContainer>
  );
}

export default ContainerWithStatusBar;
