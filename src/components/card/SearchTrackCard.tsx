import React, { Component } from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import {
  Bold12,
  Bold16,
  Regular14,
  Regular12
} from "src/components/text/Typographies";
import colors from "src/styles/colors";
import XEIcon from "src/components/icon/XEIcon";
import { AudioType } from "src/components/player/interface";

interface IProps {
  style?: ViewProps["style"];
  thumnail: string;
  title: string;
  author: string;
  isRegistered: boolean;
  isLike: boolean;
  onLikePress: () => void;
  audioType: AudioType;
  onPlayToggle: () => void;
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 11px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.blueberry};
`;

const Content = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const ThumnailView = styled.View`
  width: 76px;
  height: 72px;
  border-radius: 8px;
  margin-right: 31px;
  overflow: hidden;
`;

const Thumnail = styled.Image`
  width: 100%;
  height: 100%;
`;

const TrackView = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-around;
  padding-vertical: 0px;
`;

const Title = styled(Bold16)`
  color: ${colors.lightGrey};
`;

const SingerName = styled(Regular14)`
  color: ${colors.lightGrey};
`;

const RegisteredSongText = styled(Regular14)`
  color: ${colors.brightMagenta};
`;

const PlayIcon = styled(XEIcon)``;

const HeartView = styled.View`
  flex-direction: row;
  align-items: center;
`;

const HeartIcon = styled(XEIcon)``;

const HeartCount = styled(Bold12)`
  color: ${colors.lightGrey};
`;

const GroupButton = styled.TouchableOpacity`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 40px;
`;

const ButtonText = styled(Regular12)`
  color: ${colors.lightGrey};
`;

function SearchTrackCard(props: IProps) {
  const {
    style,
    thumnail,
    title,
    author,
    isRegistered,
    isLike,
    onLikePress,
    audioType,
    onPlayToggle
  } = props;
  return (
    <Container style={style}>
      <Content>
        <ThumnailView>
          <Thumnail source={{ uri: thumnail }} />
        </ThumnailView>
        <TrackView>
          <Title>{title}</Title>
          <SingerName>{author}</SingerName>
          {isRegistered ? (
            <RegisteredSongText>
              이미 등록되어 있는 곡 입니다.
            </RegisteredSongText>
          ) : (
            <HeartView>
              <HeartIcon name="heart" size={10} color={colors.brightMagenta} />
              <HeartCount>12</HeartCount>
            </HeartView>
          )}
        </TrackView>
        {isRegistered ? null : (
          <>
            <GroupButton onPress={onPlayToggle}>
              <PlayIcon
                name={audioType === "play" ? "pause" : "play"}
                size={30}
                color={colors.brightMagenta}
              />
              <ButtonText>미리듣기</ButtonText>
            </GroupButton>
            <GroupButton onPress={onLikePress}>
              <HeartIcon
                name={isLike ? "heart" : "heart-o"}
                size={30}
                color={colors.brightMagenta}
              />
              <ButtonText>좋아요</ButtonText>
            </GroupButton>
          </>
        )}
      </Content>
    </Container>
  );
}

export default SearchTrackCard;
