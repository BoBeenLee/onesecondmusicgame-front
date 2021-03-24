import { AdvertiseControllerApiFactory } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const advertiseControllerApi = () =>
  AdvertiseControllerApiFactory(undefined, "", requestAPI());

export const getAdvertiseKeywordUsingGET = async () => {
  const response = await advertiseControllerApi().getAdvertiseKeyword();
  return response.data.body!;
};

export const getAdvertisementsUsingGET = async () => {
  const response = await advertiseControllerApi().getAdvertisement();
  return response.data;
};
