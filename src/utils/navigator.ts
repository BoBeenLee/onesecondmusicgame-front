import { Layout, Navigation } from "react-native-navigation";

import { SCREEN_IDS } from "src/screens/constant";
import { pushTransition } from "src/screens/styles/animations";
import topbars from "src/screens/styles/topbars";
import colors from "src/styles/colors";
import { delay } from "src/utils/common";

let isLoading = false;
let currentComponentId: string | null = null;
let currentComponentName: string | null = null;

const start = () => {
  Navigation.setDefaultOptions({
    layout: {
      backgroundColor: "#fff",
      orientation: ["portrait"]
    },
    statusBar: {
      backgroundColor: colors.green50,
      style: "dark"
    },
    topBar: topbars.emptyTopBar()
  });

  setRoot({ nextComponentId: SCREEN_IDS.SplashScreen });
};

const setRoot = async ({ nextComponentId }: { nextComponentId: string }) =>
  await protectedMultiClick(() => {
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
  })();

const setCurrentComponent = (componentId: string, componentName: string) => {
  currentComponentId = componentId;
  currentComponentName = componentName;
};

const getCurrentComponent = () => {
  return currentComponentId;
};

export const protectedMultiClick = (func: any, milliseconds = 500) => async (
  ...args: any[]
) => {
  if (isLoading) {
    return;
  }
  if (!isLoading) {
    isLoading = true;
  }
  func(...args);
  await delay(milliseconds);
  isLoading = false;
};

const setStackRoot = async ({
  componentId,
  nextComponentId,
  params,
  animtaions = pushTransition
}: {
  componentId: string;
  nextComponentId: string;
  params?: object;
  animtaions?: any;
}) =>
  await protectedMultiClick(() => {
    Navigation.setStackRoot(componentId, {
      component: {
        name: nextComponentId,
        options: {
          animations: animtaions as any
        },
        passProps: params
      }
    });
  })(componentId, nextComponentId, params);

const setMainStackRoots = async ({
  componentId,
  layouts
}: {
  componentId: string;
  layouts: Layout[];
}) =>
  await protectedMultiClick(async () => {
    await Navigation.setStackRoot(componentId, layouts);
  })(componentId, layouts);

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
  })(nextComponentId, params);

const push = async (
  componentId: string,
  nextComponentId: string,
  params?: object,
  animtaions: any = pushTransition
) =>
  await protectedMultiClick(async () => {
    await Navigation.push(componentId, {
      component: {
        name: nextComponentId,
        options: {
          animations: animtaions as any
        },
        passProps: params
      }
    });
  })(componentId, nextComponentId, params);

const pushOptions = async ({
  componentId,
  nextComponentId,
  params,
  animtaions = pushTransition,
  customTransition
}: {
  componentId: string;
  customTransition?: any;
  nextComponentId: string;
  params?: object;
  animtaions?: any;
}) =>
  await protectedMultiClick(async () => {
    await Navigation.push(componentId, {
      component: {
        name: nextComponentId,
        options: {
          animations: animtaions as any,
          customTransition
        },
        passProps: params
      }
    });
  })(componentId, nextComponentId, params);

const pop = (componentId: string) => {
  Navigation.pop(componentId);
};

const popTo = (componentId: string) => {
  Navigation.popTo(componentId);
};

const showModal = async (params: Layout) =>
  await protectedMultiClick(async () => {
    await Navigation.showModal(params);
  })(params);

const showStackModal = async (componentId: string, params?: object) =>
  await protectedMultiClick(async () => {
    await Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: componentId,
              passProps: params
            }
          }
        ]
      }
    });
  })(params);

const dismissModal = (componentId: string) => {
  Navigation.dismissModal(componentId);
};

const dismissAllModals = () => {
  Navigation.dismissAllModals();
};

const showOverlay = async (params: Layout) =>
  await protectedMultiClick(async () => {
    await Navigation.showOverlay(params);
  })(params);

const showOverlayTransparent = async (componentId: string) => {
  await showOverlay({
    component: {
      name: componentId,
      options: {
        layout: {
          backgroundColor: "transparent"
        },
        overlay: {
          interceptTouchOutside: false
        },
        statusBar: {
          backgroundColor: "#00000039"
        }
      }
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
  getCurrentComponent,
  push,
  pushOptions,
  pop,
  popTo
};
