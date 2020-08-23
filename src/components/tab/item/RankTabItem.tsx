import React from "react";
import styled, { css } from "styled-components/native";

import { Bold18 } from "src/components/text/Typographies";
import colors from "src/styles/colors";

type Props = {
  active: boolean;
  title: string;
};

const Container = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled(Bold18)`
  color: ${colors.paleCyan};
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
  const { title, active } = props;
  return (
    <Container>
      <Title>{title}</Title>
      <Underline active={active} />
    </Container>
  );
};

export default RankTabItem;
