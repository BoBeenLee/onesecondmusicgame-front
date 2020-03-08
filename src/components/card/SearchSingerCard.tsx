import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { Regular12 } from "src/components/text/Typographies";
import CheckImage from "src/components/image/CheckImage";
import colors from "src/styles/colors";
import { onlyUpdateForKeys } from "recompose";

interface IProps {
  style?: ViewProps["style"];
  selected: boolean;
  image: string;
  name: string;
  onPress: () => void;
}

const Container = styled.TouchableOpacity`
  flex-direction: column;
  align-items: center;
`;

const SingerImage = styled(CheckImage)`
  width: 76px;
  height: 72px;
  margin-bottom: 4px;
`;

const Name = styled(Regular12)`
  color: ${colors.lightGrey};
`;

function SearchSingerCard(props: IProps) {
  const { style, selected, image, name, onPress } = props;
  return (
    <Container style={style} onPress={onPress}>
      <SingerImage checked={selected} source={{ uri: image }} />
      <Name>{name}</Name>
    </Container>
  );
}

const updateKeys: Array<keyof IProps> = ["style", "selected", "image", "name"];
export default onlyUpdateForKeys(updateKeys)(SearchSingerCard);
