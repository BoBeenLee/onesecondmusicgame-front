import React from "react";
import styled from "styled-components/native";
import { ViewProps } from "react-native";

import { Bold12, Bold14, Bold16 } from "src/components/text/Typographies";
import ProfileImage from "src/components/image/ProfileImage";
import colors from "src/styles/colors";
import XEIcon from "src/components/icon/XEIcon";

interface IProps {
  style?: ViewProps["style"];
  rank: number;
  name: string;
  profileImage: string;
  score: number;
  rankDiff?: number;
}

const Container = styled.View`
  width: 100%;
  height: 82px;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  background-color: ${colors.blueberry};
  padding-left: 19px;
  padding-right: 36px;
`;

const Content = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const RankIcon = styled(XEIcon)`
  margin-right: 2px;
`;

const Rank = styled(Bold14)`
  color: ${colors.lightGrey};
  margin-right: 10px;
`;

const Profile = styled(ProfileImage)`
  margin-right: 18px;
`;

const RightSide = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Name = styled(Bold16)`
  color: ${colors.lightGrey};
`;

const ScoreTitle = styled(Bold16)`
  color: ${colors.paleCyan};
  margin-right: 8px;
`;

const Score = styled(Bold12)`
  color: ${colors.lightGrey};
`;

function GameRankCard(props: IProps) {
  const { style, rank, profileImage, name, score, rankDiff } = props;

  const makeIconName = (rankDiff: number) => {
    if (rankDiff < 0) {
      return "caret-down-min";
    } else if (rankDiff === 0) {
      return "minus-min";
    } else {
      return "caret-up-min";
    }
  };

  return (
    <Container style={style}>
      <Content>
        <RankIcon
          name={makeIconName(rankDiff)}
          size={25}
          color={colors.coolGreen}
        />
        <Rank>{rank}</Rank>
        <Profile size={59} uri={profileImage} editable={false} />
        <Name>{name}</Name>
      </Content>
      <RightSide>
        <ScoreTitle>P</ScoreTitle>
        <Score>{score}</Score>
      </RightSide>
    </Container>
  );
}

export default GameRankCard;
