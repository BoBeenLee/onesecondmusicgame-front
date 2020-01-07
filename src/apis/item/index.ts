import { ItemControllerApiFactory, ResponseDTO } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

export const itemControllerApi = ItemControllerApiFactory(
  undefined,
  requestAPI,
  ""
);

export enum ItemType {
  SKIP = "SKIP",
  ONE_MORE_SECOND = "ONE_MORE_SECOND"
}

export interface IItem {
  itemType: ItemType;
  count: number;
}

export interface IItemAllResponse extends ResponseDTO {
  body: IItem[];
}

export const findItemAllUsingGET = async () => {
  return (await itemControllerApi.findItemAllUsingGET()) as Promise<
    IItemAllResponse
  >;
};
