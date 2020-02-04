import React from "react";
import { ImageProps } from "react-native";
import styled, { css } from "styled-components/native";

import colors from "src/styles/colors";

interface IProps extends ImageProps {
  checked: boolean;
}

const Container = styled.View<{ checked: boolean }>`
  ${({ checked }) =>
    checked
      ? css`
          border-width: 5px;
          border-radius: 8px;
          border-color: ${colors.paleCyan};
          shadow-color: ${colors.paleCyan};
          shadow-offset: 0px 0px;
          shadow-opacity: 1;
          shadow-radius: 5px;
          elevation: 3;
        `
      : css``}
`;

const Image = styled.Image`
  border-radius: 5px;
`;

const CheckImage = (props: IProps) => {
  const { checked, ...rest } = props;
  return (
    <Container checked={checked}>
      <Image {...rest} />
    </Container>
  );
};

export default CheckImage;
