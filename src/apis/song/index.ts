import {
  SongControllerApiFactory,
  SongRegisterRequest
} from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const songControllerApi = () =>
  SongControllerApiFactory(undefined, "", requestAPI());

export const songByTrackId = async (trackId: number) => {
  const response = await songControllerApi().getSongUsingGET(trackId);
  return response.data.body;
};

export const addNewSongUsingPOST = async (params: SongRegisterRequest) => {
  const response = await songControllerApi().addNewSongUsingPOST(params);
  return response.data.body;
};
