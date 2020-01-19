import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import _ from "lodash";

import env from "src/configs/env";
import { getStringValue } from "src/configs/remoteConfig";

let clientId = "a281614d7f34dc30b665dfcaa3ed7505";

export const soundCloudAPI = async <T>(config: AxiosRequestConfig) => {
  const response: AxiosResponse<T> = await axios({
    ...config,
    params: {
      ...config.params,
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_id: clientId
    },
    baseURL: env.SOUNDCLOUD_API_URL
  });
  return response.data;
};

export const makePlayStreamUri = (uri: string) => {
  return `${uri}?client_id=${clientId}`;
};

export const makePlayStreamUriByTrackId = (trackId: string) => {
  return `https://api.soundcloud.com/tracks/${trackId}/stream?client_id=${clientId}`;
};

export const initialize = async () => {
  clientId = await getStringValue(
    "SOUNDCLOUD_CLIENT_ID",
    "a281614d7f34dc30b665dfcaa3ed7505"
  );
};
