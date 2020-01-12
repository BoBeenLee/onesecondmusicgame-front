import { ItemControllerApiFactory } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

export const itemControllerApi = ItemControllerApiFactory(
  undefined,
  requestAPI,
  ""
);