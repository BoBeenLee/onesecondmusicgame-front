import React from "react";
import styled, { css } from "styled-components/native";
import { ViewProps } from "react-native";

import { Bold12, Bold16 } from "src/components/text/Typographies";
import colors from "src/styles/colors";
import ProfileImage from "src/components/image/ProfileImage";

interface IProps {
  style?: ViewProps["style"];
  rank: number;
  name: string;
  profileImage: string;
  score: number;
}

interface IContainerProps {
  rank: number;
}

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  position: relative;
  ${(props: IContainerProps) => {
    switch (props.rank) {
      case 2:
        return css`
          top: 30px;
        `;
      case 3:
        return css`
          top: 60px;
        `;
    }
  }}
`;

const Content = styled.View`
  width: 90%;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
`;

const Profile = styled(ProfileImage)``;

const Name = styled(Bold16)`
  color: ${colors.lightGrey};
  font-size: 14px;
  text-align: center;
`;

const Score = styled(Bold12)`
  color: ${colors.lightGrey};
  font-size: 14px;
  text-align: center;
`;

const PointString = styled.Text`
  color: ${colors.paleCyan};
  font-size: 16px;
  margin-right: 8px;
`;

const UserInfoWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function GameTopRankCard(props: IProps) {
  const { style, rank, profileImage, name, score } = props;
  return (
    <Container style={style} rank={rank}>
      <Content>
        <UserInfoWrapper>
          <Profile size={59} uri={profileImage} />
          <Name numberOfLines={1}>{name}</Name>
          <Score>
            <PointString>P</PointString> {score}
          </Score>
        </UserInfoWrapper>
      </Content>
    </Container>
  );
}

export default GameTopRankCard;
