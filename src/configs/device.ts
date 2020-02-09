import DeviceInfo from "react-native-device-info";

export const getVersion = () => DeviceInfo.getVersion();

export const getBuildNumber = () => DeviceInfo.getBuildNumber();

export const getUniqueID = () => DeviceInfo.getUniqueId();
