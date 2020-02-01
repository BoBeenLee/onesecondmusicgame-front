import React from "react";
import colors from "src/styles/colors";
import styled from "styled-components/native";
import { ViewProps } from "react-native";

import XEIcon from "src/components/icon/XEIcon";

interface IProps {
  style?: ViewProps["style"];
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 14px;
  border: solid 3px ${colors.lightBlueGrey};
  background-color: ${colors.paleLavender};
`;

const ArrowIcon = styled(XEIcon)`
  margin-horizontal: -7px;
`;

const SkipIcon = (props: IProps) => {
  const { style } = props;
  return (
    <Container style={style}>
      <ArrowIcon name="angle-right" size={26} color={colors.pinkyPurpleThree} />
      <ArrowIcon name="angle-right" size={26} color={colors.pinkyPurpleThree} />
    </Container>
  );
};

export default SkipIcon;
