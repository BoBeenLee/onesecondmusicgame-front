import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";
import colors from "src/styles/colors";
import images from "src/images";

interface IProps {
  style?: ViewProps["style"];
  size: number;
  editable?: boolean;
  uri: string;
}

const Container = styled.View<{
  size: number;
}>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`;

const ProfileView = styled.View<{
  size: number;
  borderRadius: number;
}>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ borderRadius }) => borderRadius}px;
  overflow: hidden;
`;

const Profile = styled.Image`
  width: 100%;
  height: 100%;
`;

const Editable = styled.View`
  position: absolute;
  bottom: -1px;
  right: -1px;
  justify-content: center;
  align-items: center;
  width: 23px;
  height: 23px;
  background-color: ${colors.lightMagenta};
  border-radius: 12px;
`;

const EditableIcon = styled.Image`
  width: 11px;
  height: 12px;
  resize-mode: contain;
`;

function ProfileImage({ style, size, uri, editable }: IProps) {
  const borderRadius: number = size / 2;
  const source = uri ? { uri } : images.profileDefault;
  return (
    <Container style={style} size={size}>
      <ProfileView size={size} borderRadius={borderRadius}>
        <Profile source={source} />
      </ProfileView>
      {editable ? (
        <Editable>
          <EditableIcon source={images.pencil} />
        </Editable>
      ) : null}
    </Container>
  );
}

ProfileImage.defaultProps = {
  source: { uri: "https://via.placeholder.com/350x350" }
};

export default ProfileImage;
