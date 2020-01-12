import { HeartControllerApiFactory, ResponseDTO } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const heartControllerApi = HeartControllerApiFactory(undefined, requestAPI, "");

export const checkMyHeartUsingGET = async () => {
  const response = await heartControllerApi.checkMyHeartUsingGET();
  return response.body!;
};

export const useHeartUsingPUT = async () => {
  const response = await heartControllerApi.useHeartUsingPUT();
  return response.body!;
};
