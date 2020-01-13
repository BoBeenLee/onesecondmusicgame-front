import React, { Component } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  border-top: 1px solid rgb(204, 204, 204);
`;

const MenuStyled = styled.div`
  padding: 30px 20px;
`;

const Title = styled.div`
  font-weight: 600;
  margin-bottom: 25px;
`;

const SubTitle = styled.div`
  margin-bottom: 5px;
  font-size: 11px;
  line-height: 1.7;
`;

const Content = styled(MenuStyled)`
  display: flex;
  flex: 1;
`;

const About = styled(MenuStyled)`
  background-color: rgb(245, 245, 245);
`;

const Offices = styled(MenuStyled)``;

const Resources = styled(MenuStyled)`
  background-color: rgb(245, 245, 245);
`;

const Contact = styled(MenuStyled)``;

class Footer extends Component {
  public render() {
    return <Container>Hello World</Container>;
  }
}

export default Footer;
