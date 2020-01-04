import { MusicUserControllerApiFactory } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

export const userControllerApi = MusicUserControllerApiFactory(
  undefined,
  requestAPI,
  ""
);
