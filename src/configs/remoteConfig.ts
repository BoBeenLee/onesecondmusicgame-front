import _ from "lodash";
import firebase from "react-native-firebase";

import { isProduction } from "src/configs/env";
import { isJSON } from "src/utils/common";

const initialize = async () => {
  try {
    if (!isProduction()) {
      firebase.config().enableDeveloperMode();
    }
    firebase.config().setDefaults({});
    await firebase.config().fetch(0);
    firebase.config().activateFetched();
  } catch (error) {
    return;
  }
};

const getStringValue = async (key: string, defaultValue: string) => {
  try {
    const value = await firebase.config().getValue(key);
    return value.val();
  } catch (error) {
    return defaultValue;
  }
};

const getBooleanValue = async (key: string, defaultValue: boolean) => {
  try {
    const value = await firebase.config().getValue(key);
    return value.val() ? Boolean(value.val()) : false;
  } catch (error) {
    return defaultValue;
  }
};

const getJSONValue = async <T>(key: string, defaultValue: T) => {
  const value = await firebase.config().getValue(key);
  const val = value.val();

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
    await firebase.config().fetch(0);
    await firebase.config().activateFetched();
    const value = (await firebase.config().getValue(key)).val();

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
