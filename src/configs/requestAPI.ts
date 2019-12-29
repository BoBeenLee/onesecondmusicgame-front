import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import _ from "lodash";

import env from "src/configs/env";
import { getRootStore } from "src/stores/Store";
import { OSMGError } from "src/configs/error";

export const requestAPI = async <T>(config: AxiosRequestConfig) => {
  const headers = {
    // Authorization: `JWT ${getStore().authStore.accessToken}`,
    ...config.headers
  };

  const response: AxiosResponse<T> = await axios({ ...config, headers });
  return response.data;
};

export const initialize = () => {
  axios.defaults.baseURL = env.API_URL;

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
