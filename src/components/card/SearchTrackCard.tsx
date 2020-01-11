import React, { Component } from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { Bold10, Bold12 } from "src/components/text/Typographies";
import MiniAudioPlayer from "src/components/player/MiniAudioPlayer";

interface IProps {
  style?: ViewProps["style"];
  thumnail: string;
  title: string;
  author: string;
  onPress?: () => void;
}

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  height: 50px;
`;

const Content = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const Thumnail = styled.Image`
  width: 50px;
  height: 50px;
  margin-right: 10px;
`;

const TrackView = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-around;
  padding-vertical: 0px;
`;

const MiniAudioPlayerView = styled(MiniAudioPlayer)`
  margin-right: 10px;
`;

const Title = styled(Bold12)``;

const Author = styled(Bold10)``;

const Date = styled(Bold10)``;

const DateView = styled.View``;

function SearchTrackCard(props: IProps) {
  const { style, thumnail, title, author, onPress } = props;
  return (
    <Container style={style} onPress={onPress}>
      <Content>
        <Thumnail source={{ uri: thumnail }} />
        <MiniAudioPlayerView
          size={40}
          source={{
            uri:
              "https://api.soundcloud.com/tracks/736765723/stream?client_id=a281614d7f34dc30b665dfcaa3ed7505"
          }}
        />
        <TrackView>
          <Title>{title}</Title>
          <Author>{author}</Author>
        </TrackView>
      </Content>
      <DateView>
        <Date>10 year ago</Date>
      </DateView>
    </Container>
  );
}

export default SearchTrackCard;
