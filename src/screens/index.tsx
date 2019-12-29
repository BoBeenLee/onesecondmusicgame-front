import hoistNonReactStatic from "hoist-non-react-statics";
import _ from "lodash";
import { Navigation } from "react-native-navigation";
import { compose } from "recompose";

import { isReactotron, setupReactotron, withOverlay } from "ReactotronConfig";
import withAppState from "src/hocs/withAppState";
import withNavigator from "src/hocs/withNavigator";
import withPopup from "src/hocs/withPopup";
import withSplash from "src/hocs/withSplash";
import withStore from "src/hocs/withStore";
import { SCREEN_IDS } from "src/screens/constant";
import SplashScreen from "src/screens/SplashScreen";
import { getRootStore } from "src/stores/Store";

interface IScreenProps {
  id: string;
  Component: React.ComponentType<any>;
}

const isDevelopment = isReactotron();

const store = getRootStore();

const enhanceOverlayScreen = (Component: React.ComponentType<any>) => {
  return compose(withNavigator, withSplash, withStore(store))(Component);
};

const enhanceScreen = (Component: React.ComponentType<any>) => {
  const EnhancedComponent = compose(
    withPopup,
    withAppState,
    withNavigator,
    withSplash,
    withStore(store),
    isDevelopment ? withOverlay : _.identity
  )(Component);

  hoistNonReactStatic(EnhancedComponent, Component);

  return EnhancedComponent;
};

const overlaies: IScreenProps[] = [];

const screens: IScreenProps[] = [
  {
    Component: SplashScreen,
    id: SCREEN_IDS.SplashScreen
  }
];

if (isDevelopment) {
  setupReactotron(store);
}

export function registerScreens() {
  _.forEach(overlaies, overlay => {
    const { id, Component } = overlay;
    Navigation.registerComponent(id, () => enhanceOverlayScreen(Component));
  });

  _.forEach(screens, screen => {
    const { id, Component } = screen;
    Navigation.registerComponent(id, () => enhanceScreen(Component));
  });
}

export { SCREEN_IDS };
