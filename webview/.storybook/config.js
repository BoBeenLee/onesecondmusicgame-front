import React from "react";
import { configure, addDecorator } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";
import styled, { createGlobalStyle } from "styled-components";

// automatically import all files ending in *.stories.js
const req = require.context("../src", true, /.stories.tsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}
global.___loader = {
  enqueue: () => {},
  hovering: () => {}
};
// Gatsby internal mocking to prevent unnecessary errors in storybook testing environment
global.__PATH_PREFIX__ = "";
// This is to utilized to override the window.___navigate method Gatsby defines and uses to report what path a Link would be taking us to if it wasn't inside a storybook
window.___navigate = pathname => {
  action("NavigateTo:")(pathname);
};

const GlobalStyle = createGlobalStyle`
  @import url("https://cdn.jsdelivr.net/npm/xeicon@2.3.3/xeicon.min.css");

  @font-face { font-family: 'BMHANNAAirOTF'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.0/BMHANNAAir.woff') format('woff'); font-weight: normal; font-style: normal; }

  @font-face { font-family: 'BMHANNAProOTF'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_seven@1.0/BMHANNAPro.woff') format('woff'); font-weight: normal; font-style: normal; }

  *, html, body {
    font-family: "BMHANNAAirOTF", sans-serif;
    font-size: 16px;
    outline: none;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    word-break: keep-all;
    flex-direction: column;
  }

  html, body, #root {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    height: 100vh;
    width: 100vw;
  }

  #root * {
    display: flex;
  }

  input {
    border-width: 0px;
    background-color: transparent;
  }
`;

const Container = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to bottom, #0d1233, #000);
`;

addDecorator(story => (
  <Container>
    <GlobalStyle />
    {story()}
  </Container>
));
addDecorator(withKnobs);

configure(loadStories, module);
