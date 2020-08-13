import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from "axios";
import _ from "lodash";

import env from "src/configs/env";
import { OSMGError } from "./error";
import { getRootStore } from "src/stores/Store";

const NORMAL_STATUS = 200;
const NORMAL_STATUS_ = 2000;

export const requestAPI = (): AxiosInstance => {
  const userAccessToken = getRootStore().authStore.user?.userAccessToken;
  const nickname = getRootStore().authStore.user?.nickname;
  const headers = {
    ...(userAccessToken ? { token: userAccessToken } : {}),
    ...(nickname ? { "x-user-nickname": nickname } : {})
  };
  const configs: AxiosRequestConfig = {
    headers
  };

  const client = axios.create({
    baseURL: env.API_URL,
    ...configs
  });

  client.interceptors.response.use(
    response => {
      if (
        ![NORMAL_STATUS_, NORMAL_STATUS].some(
          status => status === (response?.data?.status ?? NORMAL_STATUS)
        )
      ) {
        throw new OSMGError({
          status: response?.data?.status ?? 0,
          body: response?.data?.body ?? `${response?.data?.status ?? ""}`
        });
      }
      return response;
    },
    error => {
      return Promise.reject(error);
    }
  );
  return client;
};

export const initialize = () => {
  // NOTHING
};
