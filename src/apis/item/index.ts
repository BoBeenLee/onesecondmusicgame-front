import { ItemControllerApiFactory, ItemUseRequest } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const itemControllerApi = () =>
  ItemControllerApiFactory(undefined, "", requestAPI());

export const findItemAllUsingGET = async () => {
  const response = await itemControllerApi().findItemAll();
  return response.data.body!;
};

export const useItemUsingPUT = async (params: ItemUseRequest) => {
  const response = await itemControllerApi().useItem(params);
  return response.data.body!;
};
