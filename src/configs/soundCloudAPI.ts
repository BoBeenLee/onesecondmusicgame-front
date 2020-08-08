import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import _ from "lodash";

import env from "src/configs/env";
import { getRootStore } from "src/stores/Store";

export const soundCloudAPI = async <T>(config: AxiosRequestConfig) => {
  const response: AxiosResponse<T> = await axios({
    ...config,
    params: {
      ...config.params,
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_id: getRootStore().authStore.soundCloudCliendId
    },
    baseURL: env.SOUNDCLOUD_API_URL
  });
  return response.data;
};

export const makePlayStreamUri = (uri: string) => {
  return `${uri}?client_id=${getRootStore().authStore.soundCloudCliendId}`;
};

export const makePlayStreamUriByTrackId = (trackId: string) => {
  return `https://api.soundcloud.com/tracks/${trackId}/stream?client_id=${
    getRootStore().authStore.soundCloudCliendId
  }`;
};

export const getPlayStreamUri = async (uri: string) => {
  if (!uri) {
    return "";
  }
  const response: AxiosResponse<{ url: string }> = await axios({
    url: uri,
    params: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_id: getRootStore().authStore.soundCloudCliendId
    }
  });
  const data = response.data;
  return data.url;
};
