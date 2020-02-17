import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import images from "src/images";
import colors from "src/styles/colors";
import { Bold16, Regular16 } from "src/components/text/Typographies";

interface IProps {
  style?: ViewProps["style"];
  singerName: string;
}

const Container = styled.View`
  height: 39px;
  flex-direction: row;
  align-items: center;
  padding-horizontal: 22px;
  border-radius: 19px;
  background-color: ${colors.dark};
`;

const SingerView = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const SingerIcon = styled.Image`
  width: 15px;
  height: 21px;
  margin-right: 8px;
`;

const SingerTitle = styled(Regular16)`
  color: ${colors.lightGrey};
`;

const SingerName = styled(Bold16)`
  color: ${colors.lightGrey};
`;

const SingerNameCard = (props: IProps) => {
  const { style, singerName } = props;
  return (
    <Container style={style}>
      <SingerView>
        <SingerIcon source={images.icSinger} />
        <SingerTitle>가수</SingerTitle>
      </SingerView>
      <SingerName>{singerName}</SingerName>
    </Container>
  );
};

export default SingerNameCard;
