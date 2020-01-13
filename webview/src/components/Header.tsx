import React, { Component } from "react";
import colors from "src/styles/colors";
import { media } from "src/utils/media";
import styled from "styled-components";

const Container = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 3.5rem;
  background-color: ${colors.white};
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  transition: padding 0.1s;
  ${media.mobile`
    height: 3.5rem;
    padding-left: 1rem;
  `}
  ${media.desktop`
    height: 4.5rem;
    padding-left: 15rem;
  `};
`;

export default class Header extends Component {
  public render() {
    return <Container>Hello World</Container>;
  }
}
