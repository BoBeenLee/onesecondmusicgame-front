import { GameControllerApiFactory, GameRequest } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const gameControllerApi = GameControllerApiFactory(undefined, requestAPI, "");

export const getHighlightListUsingGET = async (params: GameRequest) => {
  const response = await gameControllerApi.getHighlightListUsingGET(params);
  return response.body!;
};
