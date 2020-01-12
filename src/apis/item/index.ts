import { ItemControllerApiFactory } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const itemControllerApi = ItemControllerApiFactory(undefined, requestAPI, "");

export const findItemAllUsingGET = async () => {
  const response = await itemControllerApi.findItemAllUsingGET();
  return response.body ?? [];
};

export const useItemUsingPUT = async (type: string) => {
  const response = await itemControllerApi.useItemUsingPUT(type);
  return response.body;
};
