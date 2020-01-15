import React, { Component } from "react";
import styled from "styled-components/native";

import XEIcon from "src/components/icon/XEIcon";

const Container = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Heart = styled(XEIcon).attrs({
  name: "heart",
  size: 24,
  color: "#000"
})``;

class HeartGroup extends Component {
  public render() {
    return (
      <Container>
        <Heart />
        <Heart />
        <Heart />
      </Container>
    );
  }
}

export default HeartGroup;
