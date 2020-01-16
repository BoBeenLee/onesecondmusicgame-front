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
  flex-direction: row;
  align-items: center;
  background-color: #eaeaea;
  padding: 18px;
`;

const Content = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const Rank = styled(Bold24)`
  margin-right: 18px;
`;

const Profile = styled(ProfileImage)`
  margin-right: 15px;
`;

const RightSide = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Name = styled(Bold12)`
  margin-right: 4px;
`;

const Score = styled(Bold12)``;

function GameRankCard(props: IProps) {
  const { style, rank, profileImage, name, score } = props;
  return (
    <Container style={style}>
      <Content>
        <Rank>{rank}</Rank>
        <Profile size={24} source={{ uri: profileImage }} />
      </Content>
      <RightSide>
        <Name>{name}</Name>
        <Score>{score}점</Score>
      </RightSide>
    </Container>
  );
}

export default GameRankCard;
