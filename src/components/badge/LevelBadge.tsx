import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { Bold10 } from "src/components/text/Typographies";
import colors from "src/styles/colors";

type Level = "hard" | "medium" | "easy";

interface IProps {
  style?: ViewProps["style"];
  level: Level;
}

const Container = styled.View`
  border-radius: 13px;
  border: solid 1px ${colors.warmGrey};
  padding-horizontal: 18px;
  padding-vertical: 7px;
`;

const Text = styled(Bold10)``;

function LevelBadge(props: IProps) {
  const { style, level } = props;
  return (
    <Container style={style}>
      <Text>{level}</Text>
    </Container>
  );
}

export default LevelBadge;
