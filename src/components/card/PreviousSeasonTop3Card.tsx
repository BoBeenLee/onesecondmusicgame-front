import _ from "lodash";
import React from "react";
import styled from "styled-components/native";
import colors from "src/styles/colors";
import { Bold14, Bold12 } from "../text/Typographies";
import { ViewProps } from "react-native";

export type SeasonItem = {
  name: string;
  point: number;
};

type Props = {
  style?: ViewProps["style"];
  title: string;
  data: SeasonItem[];
};

const Container = styled.View`
  width: 300px;
  flex-direction: column;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Title = styled(Bold14)`
  color: ${colors.lightGrey};
  margin-left: 12px;
  margin-right: 12px;
`;

const Seperator = styled.View`
  height: 2px;
  background-color: ${colors.straw};
`;

const HeaderSeperator = styled(Seperator)`
  flex: 1;
`;

const Content = styled.View`
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 12px;
  padding-right: 12px;
`;

const RankGroup = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const RankName = styled(Bold12)`
  color: ${colors.lightGrey};
`;

const RankPoint = styled(Bold12)`
  color: ${colors.lightGrey};
`;

const PreviousSeasonTop3Card = (props: Props) => {
  const { style, title, data } = props;
  return (
    <Container style={style}>
      <Header>
        <HeaderSeperator />
        <Title>{title}</Title>
        <HeaderSeperator />
      </Header>
      <Content>
        {_.map(data, (item, index) => {
          const { name, point } = item;
          return (
            <RankGroup key={`rank${index}`}>
              <RankName>{`${index + 1}. ${name}`}</RankName>
              <RankPoint>{`P ${point}`}</RankPoint>
            </RankGroup>
          );
        })}
      </Content>
      <Seperator />
    </Container>
  );
};

export default PreviousSeasonTop3Card;
