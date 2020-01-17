import React from "react";
import styled from "styled-components/native";
import { ViewProps, TouchableOpacityProps } from "react-native";

import { Bold12 } from "src/components/text/Typographies";

interface IProps extends TouchableOpacityProps {
  name: string;
}

const Container = styled.TouchableOpacity`
  padding: 10px;
  background-color: #999999;
`;

const Text = styled(Bold12)``;

const MockButton = (props: IProps) => {
  const { style, name, onPress } = props;
  return (
    <Container style={style} onPress={onPress}>
      <Text>{name}</Text>
    </Container>
  );
};

export default MockButton;
