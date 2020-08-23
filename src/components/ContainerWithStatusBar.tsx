import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";
import SafeAreaView from "react-native-safe-area-view";
import LinearGradient from "react-native-linear-gradient";

import colors from "src/styles/colors";
import { isAndroid, getBottomSpace } from "src/utils/device";

interface IProps {
  children?: React.ReactNode;
  style?: ViewProps["style"];
  statusBarColor?: string;
  bottomBackgroundColor?: string;
}

const SafeAreaContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${colors.darkIndigo};
`;

const AndroidContainer = styled.View`
  flex: 1;
  background-color: ${colors.darkIndigo};
`;

const Container = styled(LinearGradient).attrs({
  colors: [colors.darkIndigo, colors.almostBlack]
})`
  flex: 1;
`;

const Bottom = styled.View<{ bottomBackgroundColor: string }>`
  width: 100%;
  height: ${getBottomSpace()}px;
  background-color: ${({ bottomBackgroundColor }) => bottomBackgroundColor};
`;

function ContainerWithStatusBar({
  children,
  statusBarColor = "white",
  bottomBackgroundColor = colors.almostBlack,
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
    <React.Fragment>
      <SafeAreaContainer>
        <Container style={style}>{children}</Container>
      </SafeAreaContainer>
      <Bottom bottomBackgroundColor={bottomBackgroundColor} />
    </React.Fragment>
  );
}

export default ContainerWithStatusBar;
