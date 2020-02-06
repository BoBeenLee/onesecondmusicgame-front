import React from "react";
import { TextProps, ViewProps } from "react-native";

import styled from "styled-components/native";
import colors from "src/styles/colors";

interface IProps {
  style?: ViewProps["style"];
  TextComponent: React.ReactNode;
}

const Container = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Underline = styled.View`
  width: 100%;
  height: 2px;
  background-color: ${colors.purply};
  margin-top: 1px;
`;

const UnderlineText = (props: IProps) => {
  const { style, TextComponent } = props;
  return (
    <Container style={style}>
      {TextComponent}
      <Underline />
    </Container>
  );
};

export default UnderlineText;
