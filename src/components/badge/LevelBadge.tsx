import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { Bold10 } from "src/components/text/Typographies";
import colors from "src/styles/colors";

type Level = "SUPER HARD" | "HARD" | "MEDIUM" | "EASY";

interface IProps {
  style?: ViewProps["style"];
  level: Level;
}

const Container = styled.View`
  min-width: 84px;
  justify-content: center;
  align-items: center;
  border-radius: 17px;
  padding-vertical: 5px;
  background-color: ${colors.purply};
`;

const Text = styled(Bold10)`
  color: ${colors.paleLavender};
`;

function LevelBadge(props: IProps) {
  const { style, level } = props;
  return (
    <Container style={style}>
      <Text>{level}</Text>
    </Container>
  );
}

export default LevelBadge;
