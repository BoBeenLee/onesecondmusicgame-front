import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import _ from "lodash";

import env from "src/configs/env";
import { getRootStore } from "src/stores/Store";
import { OSMGError } from "src/configs/error";
import { FetchAPI } from "__generate__/api";

interface IOptions {
  headers: object;
  body: object;
}

export const requestAPI: FetchAPI = async <T>(
  url: string,
  config: IOptions
) => {
  const headers = {
    // Authorization: `JWT ${getStore().authStore.accessToken}`,
    ...config.headers
  };
  const data = config.body;

  const response: AxiosResponse<T> = await axios({
    baseURL: env.API_URL,
    url,
    data,
    headers
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
