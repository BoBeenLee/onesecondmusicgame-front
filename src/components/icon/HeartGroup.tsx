import React, { Component } from "react";
import styled from "styled-components/native";
import { ViewProps } from "react-native";

import XEIcon from "src/components/icon/XEIcon";
import _ from "lodash";
import colors from "src/styles/colors";

export type HeartCheck = "active" | "inactive";

interface IProps {
  style?: ViewProps["style"];
  hearts: HeartCheck[];
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
`;

const HeartItem = styled(XEIcon)``;

function HeartGroup(props: IProps) {
  const { style, hearts } = props;
  return (
    <Container style={style}>
      {_.map(hearts, (heart, index) => {
        return (
          <HeartItem
            key={`indicator${index}`}
            name={"heart"}
            size={36}
            color={
              heart === "active" ? colors.pinkyPurple : colors.pinkyPurple03
            }
          />
        );
      })}
    </Container>
  );
}

export default HeartGroup;
