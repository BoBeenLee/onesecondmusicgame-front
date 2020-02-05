import _ from "lodash";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";
import styled from "styled-components/native";

import {
  Bold8,
  Bold10,
  Bold12,
  Bold13,
  Bold14,
  Bold15,
  Bold16,
  Bold17,
  Bold18,
  Bold19,
  Bold20,
  Bold24,
  Bold27,
  Bold28,
  Bold36,
  Medium7,
  Medium8,
  Medium10,
  Medium12,
  Medium14,
  Medium15,
  Medium16,
  Medium20,
  Regular10,
  Regular12,
  Regular14,
  Regular15,
  Regular16,
  Regular17,
  Regular20,
  Regular24
} from "src/components/text/Typographies";
import TimerText from "src/components/text/TimerText";
import colors from "src/styles/colors";

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const BodyText = styled(Regular12)`
  color: ${colors.gray700};
`;

storiesOf("Text", module)
  .addDecorator((getStory: any) => <CenterView>{getStory()}</CenterView>)
  .add("ReadMoreText", () => {
    return (
      <BodyText>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis
        numquam assumenda repudiandae porro quisquam dolorum, itaque est, fuga
        hic aspernatur architecto excepturi aliquid suscipit odit officiis,
        quaerat magni voluptates consectetur!
      </BodyText>
    );
  })
  .add("TimerText", () => {
    return <TimerText seconds={10} onTimeEnd={action("onTimeEnd")} />;
  })
  .add("Typographies", () => {
    const Typo = {
      Bold8,
      Bold10,
      Bold12,
      Bold13,
      Bold14,
      Bold15,
      Bold16,
      Bold17,
      Bold18,
      Bold19,
      Bold20,
      Bold24,
      Bold27,
      Bold28,
      Bold36,
      Medium7,
      Medium8,
      Medium10,
      Medium12,
      Medium14,
      Medium15,
      Medium16,
      Medium20,
      Regular10,
      Regular12,
      Regular14,
      Regular15,
      Regular16,
      Regular17,
      Regular20,
      Regular24
    };
    return _.map(Typo, (TypoText: any, key: string) => {
      return <TypoText style={{ color: "#fff" }}>{key}</TypoText>;
    });
  });
