import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { Regular12 } from "src/components/text/Typographies";
import colors from "src/styles/colors";

interface IProps {
  style?: ViewProps["style"];
  image: string;
  name: string;
  onPress: () => void;
}

const Container = styled.TouchableOpacity`
  flex-direction: column;
  align-items: center;
`;

const SingerImage = styled.Image`
  width: 76px;
  height: 72px;
  border-radius: 8px;
  border: solid 1px ${colors.lightGrey};
  margin-bottom: 4px;
`;

const Name = styled(Regular12)`
  color: ${colors.lightGrey};
`;

function SearchSingerCard(props: IProps) {
  const { style, image, name, onPress } = props;
  return (
    <Container style={style} onPress={onPress}>
      <SingerImage source={{ uri: image }} />
      <Name>{name}</Name>
    </Container>
  );
}

export default SearchSingerCard;
