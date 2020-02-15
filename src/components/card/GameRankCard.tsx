import React from "react";
import styled from "styled-components/native";
import { ViewProps, View } from "react-native";

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
  rankDiff: number;
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

const LeftWrapper = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Rank = styled(Bold12)`
  color: ${colors.lightGrey};
  margin-right: 10px;
`;

const RankNumber = styled(Bold16)`
  color: ${colors.lightGrey};
`;

const RankIcon = styled(XEIcon)``;

const RankDiff = styled(View)`
  margin-right: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RankDiffText = styled(Bold12)`
  color: ${colors.lightGrey};
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
  width: 45%;
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
        <LeftWrapper>
          <Rank>
            <RankNumber>{rank}</RankNumber>위
          </Rank>
          <RankDiff>
            <RankIcon
              name={makeIconName(rankDiff)}
              size={15}
              color={colors.coolGreen}
            />
            <RankDiffText>{rankDiff}</RankDiffText>
          </RankDiff>
        </LeftWrapper>
        <Profile size={59} uri={profileImage} editable={false} />
        <Name numberOfLines={1}>{name}</Name>
      </Content>
      <RightSide>
        <ScoreTitle>P</ScoreTitle>
        <Score>{score}</Score>
      </RightSide>
    </Container>
  );
}

export default GameRankCard;
