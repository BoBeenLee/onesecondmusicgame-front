import { Navigation } from "react-native-navigation";

import { isStorybook } from "src/configs/env";
import { registerScreens } from "src/screens";
import { start as navigatorStart } from "src/utils/navigator";
import { initialize as initializeSentry } from "src/configs/sentry";

async function start() {
  initializeSentry();
  registerScreens();

  Navigation.events().registerAppLaunchedListener(() => {
    navigatorStart();
  });
}

if (isStorybook()) {
  // tslint:disable-next-line:no-var-requires
  const startStorybook = require("/storybook/storybook").default;
  startStorybook();
} else {
  start();
}
