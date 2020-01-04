import { HeartControllerApiFactory } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

export const heartControllerApi = HeartControllerApiFactory(
  undefined,
  requestAPI,
  ""
);
