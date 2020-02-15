import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { Bold16 } from "src/components/text/Typographies";
import colors from "src/styles/colors";
import images from "src/images";

interface IProps {
  style?: ViewProps["style"];
}

const Container = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  border: solid 3px #1b1b3b;
  background-color: rgba(37, 37, 72, 0.5);
`;

const EmptyIcon = styled.Image`
  width: 56px;
  height: 56px;
`;

const Name = styled(Bold16)`
  color: ${colors.lightBlueGrey};
  margin-top: 22px;
`;

const GameItemEmptyCard = (props: IProps) => {
  const { style } = props;
  return (
    <Container style={style}>
      <EmptyIcon source={images.icGameItemEmpty} />
      <Name>Coming soon</Name>
    </Container>
  );
};

export default GameItemEmptyCard;
