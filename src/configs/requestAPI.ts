import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import _ from "lodash";

import env from "src/configs/env";
import { getRootStore } from "src/stores/Store";
import { OSMGError } from "src/configs/error";
import { FetchAPI } from "__generate__/api";

interface IOptions {
  body: object;
  headers: object;
  method: any;
  query: object;
}

export const requestAPI: FetchAPI = async <T>(
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
  return response.data;
};

export const initialize = () => {
  axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      const errorData = _.get(error, ["response", "data"]);
      const errorStatus = _.get(error, ["response", "status"]);

      if (errorStatus === 401) {
        getRootStore().toastStore.showToast(
          "로그인 세션이 만료되었습니다.",
          "ERROR"
        );
        // TODO navigateSignIn
        // navigateAuthLandingScreen(navigation);
        return error;
      }
      throw new OSMGError(errorData);
    }
  );
};
