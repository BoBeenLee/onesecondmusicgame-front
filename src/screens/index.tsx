/* eslint-disable @typescript-eslint/no-explicit-any */
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
import withSafeAreaView from "src/hocs/withSafeAreaView";
import { SCREEN_IDS } from "src/screens/constant";
import SplashScreen from "src/screens/SplashScreen";
import { getRootStore } from "src/stores/Store";
import SignInScreen from "src/screens/SignInScreen";
import MainScreen from "src/screens/MainScreen";
import withToast from "src/hocs/withToast";
import RegisterSongScreen from "src/screens/song/RegisterSongScreen";
import GamePlayScreen from "src/screens/game/GamePlayScreen";
import GameRankingScreen from "src/screens/game/GameRankingScreen";
import GameResultScreen from "src/screens/game/GameResultScreen";
import GameSearchSingerScreen from "src/screens/game/GameSearchSingerScreen";
import GamePlayTutorialOverlay from "src/screens/tutorial/GamePlayTutorialOverlay";
import SearchSingerScreen from "src/screens/song/SearchSingerScreen";
import UserProfileScreen from "src/screens/user/UserProfileScreen";
import DeveloperScreen from "src/screens/DeveloperScreen";
import UserGameItemScreen from "src/screens/user/UserGameItemScreen";
import GameReadyPlayOverlay from "src/screens/game/GameReadyPlayOverlay";

interface IScreenProps {
  id: string;
  Component: React.ComponentType<any>;
}

const isDevelopment = isReactotron();

const store = getRootStore();

const enhanceOverlayScreen = (Component: React.ComponentType<any>) => {
  return compose(
    withNavigator,
    withSplash,
    withStore(store),
    withSafeAreaView
  )(Component);
};

const enhanceScreen = (Component: React.ComponentType<any>) => {
  const EnhancedComponent = compose(
    withToast,
    withPopup,
    withAppState,
    withNavigator,
    withSplash,
    withStore(store),
    withSafeAreaView,
    isDevelopment ? withOverlay : _.identity
  )(Component);

  hoistNonReactStatic(EnhancedComponent, Component);

  return EnhancedComponent;
};

const overlaies: IScreenProps[] = [
  {
    Component: GamePlayTutorialOverlay,
    id: SCREEN_IDS.GamePlayTutorialOverlay
  }
];

const screens: IScreenProps[] = [
  {
    Component: SplashScreen,
    id: SCREEN_IDS.SplashScreen
  },
  {
    Component: SignInScreen,
    id: SCREEN_IDS.SignInScreen
  },
  {
    Component: MainScreen,
    id: SCREEN_IDS.MainScreen
  },
  {
    Component: RegisterSongScreen,
    id: SCREEN_IDS.RegisterSongScreen
  },
  {
    Component: GamePlayScreen,
    id: SCREEN_IDS.GamePlayScreen
  },
  {
    Component: GameRankingScreen,
    id: SCREEN_IDS.GameRankingScreen
  },
  {
    Component: GameResultScreen,
    id: SCREEN_IDS.GameResultScreen
  },
  {
    Component: GameSearchSingerScreen,
    id: SCREEN_IDS.GameSearchSingerScreen
  },
  {
    Component: SearchSingerScreen,
    id: SCREEN_IDS.SearchSingerScreen
  },
  {
    Component: UserProfileScreen,
    id: SCREEN_IDS.UserProfileScreen
  },
  {
    Component: DeveloperScreen,
    id: SCREEN_IDS.DeveloperScreen
  },
  {
    Component: UserGameItemScreen,
    id: SCREEN_IDS.UserGameItemScreen
  },
  {
    Component: GameReadyPlayOverlay,
    id: SCREEN_IDS.GameReadyPlayOverlay
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
