import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { Bold12 } from "src/components/text/Typographies";

type Level = "hard" | "medium" | "easy";

interface IProps {
  style?: ViewProps["style"];
  level: Level;
}

const Container = styled.View`
  padding-horizontal: 18px;
  padding-vertical: 7px;
`;

const Text = styled(Bold12)``;

function LevelBadge(props: IProps) {
  const { level } = props;
  return (
    <Container>
      <Text>{level}</Text>
    </Container>
  );
};

export default LevelBadge;
