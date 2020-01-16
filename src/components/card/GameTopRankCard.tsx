import React from "react";
import styled from "styled-components/native";
import { ViewProps } from "react-native";

import { Bold12, Bold24 } from "src/components/text/Typographies";
import ProfileImage from "src/components/image/ProfileImage";

interface IProps {
  style?: ViewProps["style"];
  rank: number;
  name: string;
  profileImage: string;
  score: number;
}

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
`;

const Rank = styled(Bold24)``;

const Content = styled.View`
  width: 100%;
  flex-direction: column;
  align-items: center;
  background-color: #d8d8d8;
  padding: 16px;
`;

const Profile = styled(ProfileImage)``;

const Name = styled(Bold12)``;

const Score = styled(Bold12)``;

function GameTopRankCard(props: IProps) {
  const { style, rank, profileImage, name, score } = props;
  return (
    <Container style={style}>
      <Rank>{rank}</Rank>
      <Content>
        <Profile size={24} source={{ uri: profileImage }} />
        <Name>{name}</Name>
        <Score>{score}점</Score>
      </Content>
    </Container>
  );
}

export default GameTopRankCard;
