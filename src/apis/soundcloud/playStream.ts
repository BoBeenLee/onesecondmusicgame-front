import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import _ from "lodash";

import env from "src/configs/env";
import { getRootStore } from "src/stores/Store";
import { ITracks } from "src/apis/soundcloud/interface";

export const getTrackToPlayStreamUri = async (trackId: string) => {
  const response: AxiosResponse<ITracks> = await axios({
    url: `https://api-v2.soundcloud.com/tracks/${trackId}`,
    params: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_id: getRootStore().authStore.soundCloudCliendId
    }
  });
  const tracksResponse = response.data;
  return await getPlayStreamUri(
    tracksResponse.media.transcodings?.[0]?.url ?? ""
  );
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
