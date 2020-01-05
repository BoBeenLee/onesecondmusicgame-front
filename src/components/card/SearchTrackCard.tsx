import React, { Component } from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { Bold10, Bold12 } from "src/components/text/Typographies";

interface IProps {
  style?: ViewProps["style"];
  thumnail: string;
  title: string;
  author: string;
  onPress?: () => void;
}

const Container = styled.TouchableOpacity`
  flex-direction: row;
  height: 50px;
`;

const Thumnail = styled.Image`
  width: 50px;
  height: 50px;
  margin-right: 10px;
`;

const Content = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-around;
  padding-vertical: 0px;
`;

const Title = styled(Bold12)``;

const Author = styled(Bold10)``;

function SearchTrackCard(props: IProps) {
  const { style, thumnail, title, author, onPress } = props;
  return (
    <Container style={style} onPress={onPress}>
      <Thumnail source={{ uri: thumnail }} />
      <Content>
        <Title>{title}</Title>
        <Author>{author}</Author>
      </Content>
    </Container>
  );
}

export default SearchTrackCard;
