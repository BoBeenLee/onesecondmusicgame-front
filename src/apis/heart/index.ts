import { HeartControllerApiFactory } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const heartControllerApi = () =>
  HeartControllerApiFactory(undefined, "", requestAPI());

export const checkMyHeartUsingGET = async () => {
  const response = await heartControllerApi().checkMyHeartUsingGET();
  return response.data.body!;
};

export const useHeartUsingPUT = async () => {
  const response = await heartControllerApi().useHeartUsingPUT();
  return response.data.body!;
};
