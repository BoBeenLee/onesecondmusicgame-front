import React from "react";
import { ImageProps } from "react-native";
import styled from "styled-components/native";

interface IProps extends ImageProps {
  size: number;
}

const Container = styled.Image<{
  size: number;
  borderRadius: number;
}>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ borderRadius }) => borderRadius}px;
`;

function ProfileImage({ size, ...props }: IProps) {
  const borderRadius: number = size / 2;
  return <Container size={size} borderRadius={borderRadius} {...props} />;
}

ProfileImage.defaultProps = {
  source: { uri: "https://via.placeholder.com/350x350" }
};

export default ProfileImage;
