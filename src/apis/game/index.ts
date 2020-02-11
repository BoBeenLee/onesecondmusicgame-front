import {
  GameControllerApiFactory,
  GameStartRequest,
  GameResultRequest,
  GameAnswerCheckRequest
} from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const gameControllerApi = GameControllerApiFactory(undefined, requestAPI, "");

export const getHighlightListUsingPOST = async (params: GameStartRequest) => {
  const response = await gameControllerApi.getHighlightListUsingPOST(params);
  return response.body!;
};

export const isAnswerUsingPOST = async (params: GameAnswerCheckRequest) => {
  const response = await gameControllerApi.isAnswerUsingPOST(params);
  return response.body!;
};

export const gameResultUsingPOST = async (params: GameResultRequest) => {
  const response = await gameControllerApi.gameResultUsingPOST(params);
  return response.body!;
};
