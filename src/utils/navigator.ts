/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Layout,
  Navigation,
  LayoutComponent,
  AnimationOptions,
  LayoutStackChildren,
  Options
} from "react-native-navigation";

import { SCREEN_IDS } from "src/screens/constant";
import { pushTransition } from "src/screens/styles/animations";
import topbars from "src/screens/styles/topbars";
import colors from "src/styles/colors";
import { delay } from "src/utils/common";
import { getRootStore } from "src/stores/Store";
import SignInScreen from "src/screens/SignInScreen";
import { MainScreenStatic } from "src/screens/MainScreen";

const isLoadingByComponentId: { [key in string]: boolean } = {};
let currentComponentId: string | null = null;
let currentComponentName: string | null = null;

const start = async () => {
  const store = getRootStore();
  Navigation.setDefaultOptions({
    layout: {
      backgroundColor: "#fff",
      orientation: ["portrait"]
    },
    statusBar: {
      backgroundColor: colors.white,
      style: "dark"
    },
    topBar: topbars.emptyTopBar()
  });
  await store.initializeApp();

  const { isGuest } = store.authStore;
  if (isGuest) {
    SignInScreen.open();
    return;
  }
  MainScreenStatic.open();
};

const setRoot = async ({ nextComponentId }: { nextComponentId: string }) => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: nextComponentId
            }
          }
        ]
      }
    }
  });
};

const setCurrentComponent = (componentId: string, componentName: string) => {
  currentComponentId = componentId;
  currentComponentName = componentName;
};

const getCurrentComponentId = () => {
  return currentComponentId!;
};

export const protectedMultiClick = (
  func: any,
  componentId: string,
  milliseconds = 500
) => async (...args: any[]) => {
  if (isLoadingByComponentId[componentId]) {
    return;
  }
  if (!isLoadingByComponentId[componentId]) {
    isLoadingByComponentId[componentId] = true;
  }
  func(...args);
  await delay(milliseconds);
  isLoadingByComponentId[componentId] = false;
};

const setStackRoot = async ({
  componentId,
  nextComponentId,
  params,
  animtaions = pushTransition,
  options
}: {
  componentId: string;
  nextComponentId: string;
  params?: object;
  animtaions?: AnimationOptions;
  options?: Options;
}) =>
  await protectedMultiClick(() => {
    Navigation.setStackRoot(componentId, {
      component: {
        name: nextComponentId,
        options: {
          ...options,
          animations: animtaions
        },
        passProps: params
      }
    });
  }, componentId)(componentId, nextComponentId, params);

const setMainStackRoots = async ({
  componentId,
  layouts
}: {
  componentId: string;
  layouts: Layout[];
}) =>
  await protectedMultiClick(async () => {
    await Navigation.setStackRoot(componentId, layouts);
  }, componentId)(componentId, layouts);

const setModalStackRoot = async ({
  nextComponentId,
  params
}: {
  nextComponentId: string;
  params?: object;
}) =>
  await protectedMultiClick(async () => {
    await Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: nextComponentId,
              passProps: params
            }
          }
        ]
      }
    });
  }, nextComponentId)(nextComponentId, params);

const push = async ({
  componentId,
  nextComponentId,
  params,
  animtaions = pushTransition,
  options
}: {
  componentId: string;
  nextComponentId: string;
  params?: object;
  animtaions?: AnimationOptions;
  options?: Options;
}) =>
  await protectedMultiClick(async () => {
    await Navigation.push(componentId, {
      component: {
        name: nextComponentId,
        options: {
          ...options,
          animations: animtaions
        },
        passProps: params
      }
    });
  }, nextComponentId)(componentId, nextComponentId, params);

const pop = (componentId: string) => {
  Navigation.pop(componentId);
};

const popTo = (componentId: string) => {
  Navigation.popTo(componentId);
};

const showModal = async (params: Layout) =>
  await protectedMultiClick(async () => {
    await Navigation.showModal(params);
  }, String(params.component?.name) ?? "showModal")(params);

const showStackModal = async ({
  componentId,
  params,
  layouts = []
}: {
  componentId: string;
  params?: object;
  layouts?: LayoutStackChildren[];
}) =>
  await protectedMultiClick(async () => {
    await Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: componentId,
              passProps: params
            }
          },
          ...layouts
        ]
      }
    });
  }, componentId)(params);

const dismissModal = (componentId: string) => {
  Navigation.dismissModal(componentId);
};

const dismissAllModals = () => {
  Navigation.dismissAllModals();
};

const showOverlay = async (params: Layout) =>
  await protectedMultiClick(async () => {
    await Navigation.showOverlay(params);
  }, String(params.component?.name) ?? "showOverlay")(params);

const showOverlayTransparent = async (componentId: string, params?: object) => {
  await showOverlay({
    component: {
      name: componentId,
      options: {
        layout: {
          componentBackgroundColor: "transparent",
          backgroundColor: "transparent"
        },
        overlay: {
          interceptTouchOutside: false
        },
        statusBar: {
          backgroundColor: "#00000039"
        }
      },
      passProps: params
    }
  });
};

const dismissOverlay = (componentId: string) => {
  Navigation.dismissOverlay(componentId);
};

export {
  dismissAllModals,
  dismissModal,
  dismissOverlay,
  setCurrentComponent,
  start,
  setRoot,
  setStackRoot,
  setMainStackRoots,
  setModalStackRoot,
  showModal,
  showStackModal,
  showOverlay,
  showOverlayTransparent,
  getCurrentComponentId,
  push,
  pop,
  popTo
};
