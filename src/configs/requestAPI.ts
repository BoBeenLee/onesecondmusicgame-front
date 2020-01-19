import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import _ from "lodash";

import env from "src/configs/env";
import { ResponseDTO } from "__generate__/api";
import { OSMGError } from "./error";
import { getRootStore } from "src/stores/Store";

interface IOptions {
  body: object;
  headers: object;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  method: any;
  query: object;
}

const NORMAL_STATUS = 200;
const NORMAL_STATUS_ = 2000;

export const requestAPI: any = async <T extends ResponseDTO>(
  url: string,
  options: IOptions
) => {
  const userAccessToken = getRootStore().authStore.user?.userAccessToken;
  const headers = {
    ...(userAccessToken ? { token: userAccessToken } : {}),
    ...options.headers
  };
  const configs: AxiosRequestConfig = {
    headers,
    data: options.body,
    params: options.query,
    method: options.method,
    url
  };
  const response: AxiosResponse<T> = await axios({
    baseURL: env.API_URL,
    ...configs
  });
  if (
    ![NORMAL_STATUS_, NORMAL_STATUS].some(
      status => status === response?.data?.status
    )
  ) {
    throw new OSMGError({
      status: response?.data?.status ?? 0,
      body: response?.data?.body ?? `${response?.data?.status ?? ""}`
    });
  }
  const responseDTO: Partial<Response> = {
    headers: response.headers,
    ok: response.status === NORMAL_STATUS,
    status: response.status,
    statusText: response.statusText,
    url: response.config.url ?? "",
    redirected: false,
    json: () => Promise.resolve(response.data)
  };
  return responseDTO;
};

export const initialize = () => {
  // NOTHING
};
