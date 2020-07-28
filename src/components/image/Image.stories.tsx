import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import colors from "src/styles/colors";
import ProfileImage from "src/components/image/ProfileImage";
import AutoHeightImage from "src/components/image/AutoHeightImage";
import CheckImage from "src/components/image/CheckImage";
import { getDeviceWidth } from "src/utils/device";

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const CheckedImageView = styled(CheckImage)`
  width: 100px;
  height: 100px;
`;

storiesOf("Image", module)
  .addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
  .add("ProfileImage", () => {
    return (
      <ProfileImage
        size={24}
        uri="https://via.placeholder.com/350x350"
        editable={true}
      />
    );
  })
  .add("AutoImage", () => {
    return (
      <AutoHeightImage
        width={getDeviceWidth()}
        source={{ uri: "https://via.placeholder.com/350x350" }}
      />
    );
  })
  .add("CheckImage", () => {
    return (
      <CheckedImageView
        checked={true}
        source={{
          uri:
            "https://ww.namu.la/s/aeca2e14dbb78281beabffe6d5a8b1a84233da4aa2d7b857f11baa8530908b4faf2dae5ce55389c73821b2235cfa3c4d9744bb30d3edc6efda4a446164481c78a1bb1c035715170340ab115267691293c60780de7be9857d30154151550b16b7f9caa7f3b67f3fb370bf9f51128e8fac"
        }}
      />
    );
  });
