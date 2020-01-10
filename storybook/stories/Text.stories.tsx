import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import styled from "styled-components/native";

import { Regular12 } from "src/components/text/Typographies";
import colors from "src/styles/colors";

const BodyText = styled(Regular12)`
  color: ${colors.gray700};
`;

storiesOf("Text", module).add("ReadMoreText", () => {
  return (
    <BodyText>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis numquam
      assumenda repudiandae porro quisquam dolorum, itaque est, fuga hic
      aspernatur architecto excepturi aliquid suscipit odit officiis, quaerat
      magni voluptates consectetur!
    </BodyText>
  );
});
