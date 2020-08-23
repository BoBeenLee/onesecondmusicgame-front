import React from "react";
import { ViewProps } from "react-native";
import styled, { css } from "styled-components/native";

import { Bold18 } from "src/components/text/Typographies";
import colors from "src/styles/colors";

type Props = {
  style?: ViewProps["style"];
  active: boolean;
  title: string;
  onSelected: () => void;
};

const Container = styled.TouchableOpacity`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled(Bold18)<{ active: boolean }>`
  ${({ active }) =>
    active
      ? css`
          color: ${colors.paleCyan};
        `
      : css`
          color: ${colors.warmBlue};
        `};
  margin-bottom: 5px;
`;

const Underline = styled.View<{ active: boolean }>`
  width: 88px;
  height: 3px;
  ${({ active }) =>
    active
      ? css`
          background-color: ${colors.paleCyan};
        `
      : css`
          background-color: transparent;
        `};
`;

const RankTabItem = (props: Props) => {
  const { style, title, active, onSelected } = props;
  return (
    <Container style={style} onPress={onSelected}>
      <Title active={active}>{title}</Title>
      <Underline active={active} />
    </Container>
  );
};

export default RankTabItem;
