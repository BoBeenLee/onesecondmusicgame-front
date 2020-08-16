import _ from "lodash";
import rnFirebaseRemoteConfig from "@react-native-firebase/remote-config";

import { isProduction } from "src/configs/env";
import { isJSON } from "src/utils/common";

const buildRemoteConfig = _.once(async () => {
  const remoteConfig = rnFirebaseRemoteConfig();
  remoteConfig.setDefaults({});
  await remoteConfig.fetch(0);
  remoteConfig.fetchAndActivate();
  return remoteConfig;
});

const initialize = async () => {
  return await buildRemoteConfig();
};

const getStringValue = async (key: string, defaultValue: string) => {
  try {
    const remoteConfig = await buildRemoteConfig();
    const value = await remoteConfig.getValue(key);
    return value.asString();
  } catch (error) {
    return defaultValue;
  }
};

const getBooleanValue = async (key: string, defaultValue: boolean) => {
  try {
    const remoteConfig = await buildRemoteConfig();
    const value = await remoteConfig.getValue(key);
    return value.asBoolean();
  } catch (error) {
    return defaultValue;
  }
};

const getJSONValue = async <T>(key: string, defaultValue: T) => {
  const remoteConfig = await buildRemoteConfig();
  const value = await remoteConfig.getValue(key);
  const val = value.asString();

  if (!isJSON(val)) {
    return defaultValue;
  }
  try {
    return JSON.parse(val) as T;
  } catch (error) {
    // NOTHING
  }
  return defaultValue;
};

const getRemoteConfig = async <T>(key: string, defaultValue: T) => {
  try {
    const value = await getStringValue(key, "");
    if (isJSON(value)) {
      return JSON.parse(value);
    } else {
      return value;
    }
  } catch (error) {
    return defaultValue;
  }
};

export {
  initialize,
  getStringValue,
  getBooleanValue,
  getJSONValue,
  getRemoteConfig
};
