import React from "react";
import styled from "styled-components/native";
import { ViewProps } from "react-native";

import { Bold12 } from "src/components/text/Typographies";

interface IProps {
  style?: ViewProps["style"];
  name: string;
  onPress: () => void;
}

const Container = styled.TouchableOpacity`
  padding: 10px;
  background-color: #999999;
`;

const Text = styled(Bold12)``;

const MockButton = (props: IProps) => {
  const { name, onPress } = props;
  return (
    <Container onPress={onPress}>
      <Text>{name}</Text>
    </Container>
  );
};

export default MockButton;
