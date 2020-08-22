import AsyncStorage from "@react-native-community/async-storage";
import _ from "lodash";

import { isJSON } from "src/utils/common";
import { defaultNumber } from "src/utils/number";
import { AUTH_PROVIDER } from "src/stores/AuthStore";
import { todayFormat } from "src/utils/date";

// tslint:disable:object-literal-sort-keys
export type StorageType =
  | "ACCESS_ID"
  | "ACCESS_TOKEN"
  | "REFRESH_TOKEN"
  | "PROVIDER_TYPE"
  | "SHARED_ACCESS_ID"
  | "DO_NOT_SHOW_GAME_PLAY"
  | "DO_NOT_SHOW_REGISTER_SONG_TOOLTIP"
  | "ADMOB_UNITS_BY_DATE";

export function storageFactory(
  setItem: (key: string, value: string) => Promise<any>,
  getItem: (key: string) => Promise<string>,
  clear: () => void
) {
  const setStorageItem = (key: StorageType, value: string) => {
    return setItem(key, value);
  };

  const getStringWithDefault = async (
    key: StorageType,
    defaultItem: string
  ): Promise<string> => {
    try {
      const itemString = await getItem(key);
      return _.isEmpty(itemString) ? defaultItem : itemString;
    } catch (error) {
      return defaultItem;
    }
  };

  const getBooleanWithDefault = async (
    key: StorageType,
    defaultItem: boolean
  ): Promise<boolean> => {
    try {
      const itemString = await getItem(key);
      return _.isEmpty(itemString) ? defaultItem : itemString === "true";
    } catch (error) {
      return defaultItem;
    }
  };

  const getNumberWithDefault = async (
    key: StorageType,
    defaultItem: number
  ): Promise<number> => {
    try {
      const itemString = await getItem(key);
      return defaultNumber(itemString, defaultItem);
    } catch (error) {
      return defaultItem;
    }
  };

  const getJSONWithDefault = async <T>(
    key: StorageType,
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

  const setStorages = {
    saveDoNotShowRegisterSongTooltip: async (
      doNotShowRegisterSongTooltip: boolean
    ) => {
      await setStorageItem(
        "DO_NOT_SHOW_REGISTER_SONG_TOOLTIP",
        doNotShowRegisterSongTooltip ? "true" : "false"
      );
    },
    saveDoNotShowGamePlay: async (doNotShowGamePlay: boolean) => {
      await setStorageItem(
        "DO_NOT_SHOW_GAME_PLAY",
        doNotShowGamePlay ? "true" : "false"
      );
    },
    saveSharedAccessId: async (accessId: string) => {
      await setStorageItem("SHARED_ACCESS_ID", accessId);
    },
    saveCodePushData: async <T>(codePushKey: string, data: T) => {
      await setStorageItem(codePushKey as any, JSON.stringify(data));
    },
    saveToken: async ({
      provider,
      accessId,
      accessToken,
      refreshToken
    }: {
      provider: AUTH_PROVIDER;
      accessId: string;
      accessToken: string;
      refreshToken: string;
    }) => {
      await Promise.all([
        setStorageItem("PROVIDER_TYPE", provider),
        setStorageItem("ACCESS_ID", accessId),
        setStorageItem("ACCESS_TOKEN", accessToken),
        setStorageItem("REFRESH_TOKEN", refreshToken)
      ]);
    },
    increaseAdmobUnits: async () => {
      const map = await getJSONWithDefault<Record<string, number>>(
        "ADMOB_UNITS_BY_DATE",
        {}
      );
      const todayCount = await getStorages.todayAdmobUnitCount();
      map[todayFormat()] = todayCount + 1;
      setStorageItem("ADMOB_UNITS_BY_DATE", JSON.stringify(map));
    }
  };

  const getStorages = {
    getDoNotShowRegisterSongTooltip: () => {
      return getBooleanWithDefault("DO_NOT_SHOW_REGISTER_SONG_TOOLTIP", false);
    },
    getDoNotShowGamePlay: () => {
      return getBooleanWithDefault("DO_NOT_SHOW_GAME_PLAY", false);
    },
    getSharedAccessId: () => {
      return getStringWithDefault("SHARED_ACCESS_ID", "");
    },
    getCodePushData: async <T>(
      codePushKey: string,
      defaultData: T
    ): Promise<T> => {
      const response = await getJSONWithDefault(
        codePushKey as any,
        defaultData
      );
      return response;
    },
    getToken: async () => {
      const [
        provider,
        accessId,
        accessToken,
        refreshToken
      ] = await Promise.all([
        getStringWithDefault("PROVIDER_TYPE", "NONE"),
        getStringWithDefault("ACCESS_ID", ""),
        getStringWithDefault("ACCESS_TOKEN", ""),
        getStringWithDefault("REFRESH_TOKEN", "")
      ]);
      return {
        provider,
        accessId,
        accessToken,
        refreshToken
      };
    },
    todayAdmobUnitCount: async () => {
      const map = await getJSONWithDefault<Record<string, number>>(
        "ADMOB_UNITS_BY_DATE",
        {}
      );
      return map[todayFormat()] ?? 0;
    }
  };

  return {
    ...setStorages,
    ...getStorages,
    setItem,
    getStringWithDefault,
    getBooleanWithDefault,
    getNumberWithDefault,
    getJSONWithDefault,
    clear
  };
}

export const storage = _.once(() => {
  const setItem = async (key: string, value: string) => {
    AsyncStorage.setItem(key, value);
  };

  const getItem = async (key: string): Promise<string> => {
    const response = await AsyncStorage.getItem(key);
    return response ?? "";
  };

  const clear = () => {
    return AsyncStorage.clear();
  };
  return storageFactory(setItem, getItem, clear);
});
