import React, { Component } from "react";
import styled from "styled-components/native";
import { ViewProps } from "react-native";

import XEIcon from "src/components/icon/XEIcon";
import _ from "lodash";

export type HeartCheck = "active" | "inactive";

interface IProps {
  style?: ViewProps["style"];
  hearts: HeartCheck[];
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
`;

const HeartItem = styled(XEIcon)`
  margin-left: 4px;
  margin-right: 4px;
`;

function HeartGroup(props: IProps) {
  const { style, hearts } = props;
  return (
    <Container style={style}>
      {_.map(hearts, (heart, index) => {
        return (
          <HeartItem
            key={`indicator${index}`}
            name={heart === "active" ? "heart" : "heart-o"}
            size={24}
            color={"#000"}
          />
        );
      })}
    </Container>
  );
}

export default HeartGroup;
