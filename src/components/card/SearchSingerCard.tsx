import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import { Regular16, Bold16 } from "src/components/text/Typographies";
import HighlighterText from "src/components/text/HighlighterText";
import colors from "src/styles/colors";
import { onlyUpdateForKeys } from "recompose";

interface IProps {
  style?: ViewProps["style"];
  name: string;
  searhWord: string;
  onPress: () => void;
}

const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const Name = styled(Regular16)`
  color: ${colors.lightGrey};
`;

const HighlightName = styled(Bold16)`
  color: ${colors.pinkPurple};
`;

function SearchSingerCard(props: IProps) {
  const { style, name, searhWord, onPress } = props;
  return (
    <Container style={style} onPress={onPress}>
      <HighlighterText
        DefaultComponent={Name}
        HighlightComponent={HighlightName}
        textToHighlight={name}
        searchWords={[searhWord]}
      />
    </Container>
  );
}

const updateKeys: Array<keyof IProps> = ["style", "name", "searhWord"];
export default onlyUpdateForKeys(updateKeys)(SearchSingerCard);
