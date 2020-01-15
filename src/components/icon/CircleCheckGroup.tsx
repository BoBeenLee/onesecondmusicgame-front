import _ from "lodash";
import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import CircleCheckIcon, {
  CircleCheck
} from "src/components/icon/CircleCheckIcon";

interface IProps {
  style?: ViewProps["style"];
  checks: CircleCheck[];
}

const Container = styled.View`
  flex-direction: row;
`;

const CircleCheckView = styled(CircleCheckIcon)`
  margin-left: 8px;
  margin-right: 8px;
`;

class CircleCheckGroup extends React.PureComponent<IProps> {
  public render() {
    const { style, checks } = this.props;
    return (
      <Container style={style}>
        {_.map(checks, check => {
          return <CircleCheckView key={`indicator${index}`} check={check} />;
        })}
      </Container>
    );
  }
}

export default CircleCheckGroup;
