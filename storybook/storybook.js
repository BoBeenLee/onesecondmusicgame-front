import React, { Component } from "react";
import {
  getStorybookUI,
  configure,
  addDecorator
} from "@storybook/react-native";
import { Navigation } from "react-native-navigation";
import SplashScreen from "react-native-splash-screen";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
// import withStore from "src/hocs/withStore";
// import { getRootStore } from "src/stores/Store";

configure(() => {
  require("./stories");
}, module);

addDecorator(story => (
  <ContainerWithStatusBar>{story()}</ContainerWithStatusBar>
));

const StorybookUIRoot = getStorybookUI({ port: 7007, onDeviceUI: true });

class StorybookUIHMRRoot extends Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return <StorybookUIRoot />;
  }
}

function start() {
  Navigation.registerComponent("storybook.UI", () => StorybookUIHMRRoot);

  Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setDefaultOptions({
      topBar: {
        animate: false,
        drawBehind: true,
        visible: false
      },
      layout: {
        backgroundColor: "#fff",
        orientation: ["portrait"]
      },
      statusBar: {
        backgroundColor: "white",
        style: "dark"
      }
    });

    Navigation.setRoot({
      root: {
        stack: {
          children: [
            {
              component: {
                name: "storybook.UI"
              }
            }
          ],
          id: "storybook.UI"
        }
      }
    });
  });
}

export default start;
