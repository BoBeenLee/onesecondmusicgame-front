import { HeartControllerApiFactory } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const heartControllerApi = () =>
  HeartControllerApiFactory(undefined, "", requestAPI());

export const checkMyHeartUsingGET = async () => {
  const response = await heartControllerApi().checkMyHeart();
  return response.data.body!;
};

export const useHeartUsingPUT = async () => {
  const response = await heartControllerApi().useHeart();
  return response.data.body!;
};
