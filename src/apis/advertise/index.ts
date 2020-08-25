import { AdvertiseKeywordControllerApiFactory } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const advertiseKeywordControllerApi = () =>
  AdvertiseKeywordControllerApiFactory(undefined, "", requestAPI());

export const getAdvertiseKeywordUsingGET = async () => {
  const response = await advertiseKeywordControllerApi().getAdvertiseKeyword();
  return response.data.body!;
};
