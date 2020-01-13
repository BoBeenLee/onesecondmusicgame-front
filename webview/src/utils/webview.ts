import _ from "lodash";

export const getReactNativeWebView = <T>(data: T) => {
  if (typeof window === "undefined") {
    return;
  }
  if (_.isEmpty((window as any).ReactNativeWebView)) {
    return;
  }
  (window as any).ReactNativeWebView.postMessage(JSON.stringify(data));
};
