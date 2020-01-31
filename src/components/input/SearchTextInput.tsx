import _ from "lodash";
import React, { useState } from "react";
import { ViewProps, TextInputProps } from "react-native";
import styled from "styled-components/native";

import OSMGTextInput from "src/components/input/OSMGTextInput";
import colors from "src/styles/colors";
import XEIconButton from "src/components/button/XEIconButton";
import useDebouncedCallback from "src/hooks/useDebouncedCallback";

interface IProps extends TextInputProps {
  style?: ViewProps["style"];
  onChangeInput: (text: string) => void;
  onSearch: (text: string) => void;
}

const Container = styled.View`
  width: 100%;
  min-width: 100px;
  height: 40px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.blueberry};
`;

const Input = styled(OSMGTextInput)`
  flex: 1;
  margin-right: 3px;
`;

const SearchIcon = styled(XEIconButton).attrs({
  iconName: "search",
  iconSize: 20,
  iconColor: colors.warmBlue
})``;

function SearchTextInput(props: IProps) {
  const { style, onSearch, ...rest } = props;
  const [text, setText] = useState("");

  const onChangeInput = useDebouncedCallback(props.onChangeInput, 500);

  const onChangeText = (text: string) => {
    setText(text);
    onChangeInput(text);
  };

  return (
    <Container style={style}>
      <Input {...rest} value={text} onChangeText={onChangeText} />
      <SearchIcon onPress={_.partial(onSearch, text)} />
    </Container>
  );
}

export default SearchTextInput;
