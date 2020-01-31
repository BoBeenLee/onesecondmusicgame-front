import _ from "lodash";
import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import CircleCheckIcon, {
  CircleCheck
} from "src/components/icon/CircleCheckIcon";

export interface ICircleCheckItem {
  check: CircleCheck;
  active: boolean;
}

interface IProps {
  style?: ViewProps["style"];
  circles: ICircleCheckItem[];
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CircleCheckItem = styled(CircleCheckIcon)`
  margin-left: 12px;
  margin-right: 12px;
`;

function CircleCheckGroup(props: IProps) {
  const { style, circles } = props;
  return (
    <Container style={style}>
      {_.map(circles, (item, index) => {
        return (
          <CircleCheckItem
            key={`indicator${index}`}
            check={item.check}
            active={item.active}
          />
        );
      })}
    </Container>
  );
}

export default CircleCheckGroup;
