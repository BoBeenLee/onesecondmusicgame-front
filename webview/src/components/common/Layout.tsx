import React, { Component } from "react";
import styled, { ThemeProvider } from "styled-components";

import Footer from "src/components/Footer";
import Header from "src/components/Header";

interface IProps {
  className?: string;
}

const Container = styled.div`
  display: flex;
  flex: 1;
  min-height: 100%;
  flex-direction: row;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  background-color: #fafafa;
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 16px 20px;
`;

class Layout extends Component<IProps> {
  public render() {
    const { className } = this.props;
    return (
      <Container className={className}>
        <Content>
          <Header />
          <Body>{this.props.children}</Body>
          <Footer />
        </Content>
      </Container>
    );
  }
}

export default Layout;
