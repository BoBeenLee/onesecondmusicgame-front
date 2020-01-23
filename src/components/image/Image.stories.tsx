import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import colors from "src/styles/colors";
import ProfileImage from "src/components/image/ProfileImage";
import AutoHeightImage from "src/components/image/AutoHeightImage";
import { getDeviceWidth } from "src/utils/device";

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

storiesOf("Image", module)
  .addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
  .add("ProfileImage", () => {
    return (
      <ProfileImage
        size={24}
        source={{ uri: "https://via.placeholder.com/350x350" }}
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
  });
