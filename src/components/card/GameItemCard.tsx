import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { Bold16, Bold15 } from "src/components/text/Typographies";
import colors from "src/styles/colors";
import CountBadge from "src/components/badge/CountBadge";

interface IProps {
  style?: ViewProps["style"];
  name: string;
  count?: number;
  ContentComponent: React.ReactNode;
}

const Container = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  border: solid 3px #1b1b3b;
  background-color: ${colors.darkThree};
`;

const Content = styled.View`
  width: 56px;
  height: 56px;
`;

const Name = styled(Bold16)`
  color: ${colors.white};
  margin-top: 22px;
`;

const GameItemCard = (props: IProps) => {
  const { style, name, count, ContentComponent } = props;
  return (
    <Container style={style}>
      <Content>
        {ContentComponent}
        {count ? <CountBadge count={count} /> : null}
      </Content>
      <Name>{name}</Name>
    </Container>
  );
};

export default GameItemCard;
