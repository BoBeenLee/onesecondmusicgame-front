import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import colors from "src/styles/colors";
import { iosStatusBarHeight } from "src/utils/device";
import LinearGradient from "react-native-linear-gradient";

interface IProps {
  children?: React.ReactNode;
  style?: ViewProps["style"];
  statusBarColor?: string;
}

const Container = styled(LinearGradient).attrs({
  colors: [colors.darkIndigo, colors.almostBlack]
})`
  flex: 1;
  background-color: ${colors.white};
  padding-top: ${iosStatusBarHeight(false)}px;
`;

const OutterContainer = styled.View<{ backgroundColor: string }>`
  flex: 1;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

function ContainerWithStatusBar({
  children,
  statusBarColor = "white",
  style
}: IProps) {
  return (
    <OutterContainer backgroundColor={statusBarColor}>
      <Container style={style}>{children}</Container>
    </OutterContainer>
  );
}

export default ContainerWithStatusBar;
