import { ItemControllerApiFactory, ItemUseRequest } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const itemControllerApi = ItemControllerApiFactory(undefined, requestAPI, "");

export const findItemAllUsingGET = async () => {
  const response = await itemControllerApi.findItemAllUsingGET();
  return response.body ?? [];
};

export const useItemUsingPUT = async (params: ItemUseRequest) => {
  const response = await itemControllerApi.useItemUsingPUT(params);
  return response.body;
};
