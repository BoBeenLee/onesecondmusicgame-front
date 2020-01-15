import _ from "lodash";
import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import CircleCheckIcon, {
  CircleCheck
} from "src/components/icon/CircleCheckIcon";

interface IProps {
  style?: ViewProps["style"];
  circles: CircleCheck[];
}

const Container = styled.View`
  flex-direction: row;
`;

const CircleCheckItem = styled(CircleCheckIcon)`
  margin-left: 4px;
  margin-right: 4px;
`;

function CircleCheckGroup(props: IProps) {
  const { style, circles } = this.props;
  return (
    <Container style={style}>
      {_.map(circles, (circleCheck, index) => {
        return (
          <CircleCheckItem key={`indicator${index}`} check={circleCheck} />
        );
      })}
    </Container>
  );
}

export default CircleCheckGroup;
