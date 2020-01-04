import { SongControllerApiFactory } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

export const songControllerApi = SongControllerApiFactory(
  undefined,
  requestAPI,
  ""
);
