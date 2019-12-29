import _ from "lodash";
import { Dimensions, Platform, StatusBar } from "react-native";
import DeviceInfo from "react-native-device-info";

const getOS = (): string => Platform.OS;

const isAndroid = () => Platform.OS === "android";

const isIOS = () => Platform.OS === "ios";

export function isIphoneX() {
  const dimen = Dimensions.get("window");
  return (
    Platform.OS === "ios" &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 ||
      dimen.width === 896)
  );
}

export function ifIphoneX(iphoneXStyle: any, regularStyle: any) {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
}

export function androidStatusBarHeight() {
  if (isAndroid()) {
    return StatusBar.currentHeight;
  }
  return 0;
}

export function iosStatusBarHeight(safe: boolean) {
  if (isIOS()) {
    return ifIphoneX(safe ? 44 : 30, 20);
  }
  return 0;
}

export function getStatusBarHeight(safe: boolean) {
  return Platform.select({
    android: androidStatusBarHeight(),
    ios: iosStatusBarHeight(safe)
  });
}

export function getBottomSpace() {
  return isIphoneX() ? 34 : 0;
}

const getDeviceWidth = () => Dimensions.get("window").width;

const getDeviceHeight = () => Dimensions.get("window").height;

const getVersion = () => DeviceInfo.getVersion();

const getBuildNumber = () => DeviceInfo.getBuildNumber();

const getUniqueID = () => DeviceInfo.getUniqueId();

const conditionHeight = (
  androidHeight: number,
  iosHeight: number,
  iphoneXHeight: number
) => {
  if (isIphoneX()) {
    return iphoneXHeight;
  }
  if (isIOS()) {
    return iosHeight;
  }
  return androidHeight;
};

export {
  conditionHeight,
  isAndroid,
  isIOS,
  getBuildNumber,
  getOS,
  getDeviceWidth,
  getDeviceHeight,
  getUniqueID,
  getVersion
};
