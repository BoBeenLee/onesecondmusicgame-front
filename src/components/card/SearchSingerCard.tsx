import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { Regular12 } from "src/components/text/Typographies";
import CheckImage from "src/components/image/CheckImage";
import colors from "src/styles/colors";

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

const SingerImageView = styled.View`
  width: 76px;
  height: 72px;
  border-radius: 8px;
  border: solid 1px ${colors.lightGrey};
  margin-bottom: 4px;
  overflow: hidden;
`;

const SingerImage = styled(CheckImage)`
  width: 100%;
  height: 100%;
`;

const Name = styled(Regular12)`
  color: ${colors.lightGrey};
`;

function SearchSingerCard(props: IProps) {
  const { style, selected, image, name, onPress } = props;
  return (
    <Container style={style} onPress={onPress}>
      <SingerImageView>
        <SingerImage checked={selected} source={{ uri: image }} />
      </SingerImageView>
      <Name>{name}</Name>
    </Container>
  );
}

export default SearchSingerCard;
