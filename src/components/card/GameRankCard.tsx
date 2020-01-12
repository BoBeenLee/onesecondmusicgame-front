import React from "react";
import styled from "styled-components/native";
import { ViewProps } from "react-native";

interface IProps {
  style?: ViewProps["style"];
}

const Container = styled.View``;

const Text = styled.Text``;

function GameRankCard(props: IProps) {
  const { style } = props;
  return (
    <Container style={style}>
      <Text>Hello World</Text>
    </Container>
  );
}

export default GameRankCard;
