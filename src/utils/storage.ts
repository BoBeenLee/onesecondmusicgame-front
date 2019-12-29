import AsyncStorage from "@react-native-community/async-storage";
import _ from "lodash";

import { isJSON } from "src/utils/common";
import { getOS, getVersion } from "src/utils/device";

// tslint:disable:object-literal-sort-keys
export const FIELD = {
  ACCESS_TOKEN: "ACCESS_TOKEN",
  REFRESH_TOKEN: "REFRESH_TOKEN",
  PROVIDER_TYPE: "PROVIDER_TYPE"
};

export const setItem = (key: string, value: string) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.multiSet([[key, value]], errors => {
      if (_.isEmpty(errors)) {
        resolve(true);
        return;
      }
      reject(_.first(errors));
    });
  });
};

export const multiSet = (data: Array<[string, string]>) => {
  AsyncStorage.multiSet(data);
};

export const getItem = (key: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    AsyncStorage.multiGet([key], (errors, result) => {
      if (_.isEmpty(errors)) {
        resolve(_.get(_.first(result), ["1"], "")!);
        return;
      }
      reject(_.first(errors));
    });
  });
};

export const getItems = async (keys: string[]) => {
  const values = await Promise.all(keys.map(key => getItem(key)));
  return keys.reduce((res, key, index) => {
    return {
      ...res,
      [key]: values[index]
    };
  }, {});
};

export const defaultItemTo = async <T>(
  key: string,
  defaultItem: T
): Promise<T> => {
  try {
    const itemJSON = await getItem(key);
    if (!isJSON(itemJSON)) {
      return defaultItem;
    }
    return JSON.parse(itemJSON) as T;
  } catch (error) {
    // NOTHING
  }
  return defaultItem;
};

export const defaultItemToBoolean = async (
  key: string,
  defaultItem: boolean
): Promise<boolean> => {
  try {
    const itemString = await getItem(key);
    return _.isEmpty(itemString) ? defaultItem : itemString === "true";
  } catch (error) {
    return defaultItem;
  }
};

export const defaultItemToString = async (
  key: string,
  defaultItem: string
): Promise<string> => {
  try {
    const itemString = await getItem(key);
    return _.isEmpty(itemString) ? defaultItem : itemString;
  } catch (error) {
    return defaultItem;
  }
};

export const defaultItemToNumber = async (
  key: string,
  defaultItem: number
): Promise<number> => {
  try {
    const itemString = await getItem(key);
    return _.isNumber(itemString) ? Number(itemString) : defaultItem;
  } catch (error) {
    return defaultItem;
  }
};

export const clear = () => {
  return AsyncStorage.clear();
};
