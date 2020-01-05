import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import _ from "lodash";

import env from "src/configs/env";
import { ResponseDTO } from "__generate__/api";
import { OSMGError } from "./error";

interface IOptions {
  body: object;
  headers: object;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  method: any;
  query: object;
}

export const requestAPI: any = async <T extends ResponseDTO>(
  url: string,
  options: IOptions
) => {
  const headers = {
    // Authorization: `JWT ${getStore().authStore.accessToken}`,
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
  if (response?.data?.status !== 2000) {
    throw new OSMGError({
      status: response?.data?.status!,
      body: response?.data?.body ?? `${response?.data?.status!}`
    });
  }
  const responseDTO: Partial<Response> = {
    headers: response.headers,
    ok: response.status === 200,
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
