import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { Bold12 } from "src/components/text/Typographies";

interface IProps {
  style?: ViewProps["style"];
  image: string;
  name: string;
  onPress: () => void;
}

const Container = styled.TouchableOpacity`
  flex-direction: column;
`;

const SongImage = styled.Image`
  margin-bottom: 10px;
`;

const Name = styled(Bold12)``;

function SearchSongCard(props: IProps) {
  const { style, image, name, onPress } = props;
  return (
    <Container style={style} onPress={onPress}>
      <SongImage source={{ uri: image }} />
      <Name>{name}</Name>
    </Container>
  );
}

export default SearchSongCard;
