import { SongControllerApiFactory } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";
import _ from "lodash";

export const songControllerApi = SongControllerApiFactory(
  undefined,
  requestAPI,
  ""
);

export const songByTrackId = async (trackId: number): Promise<any> => {
  const response = await songControllerApi.getSongUsingGET(trackId);
  return response.body;
};
