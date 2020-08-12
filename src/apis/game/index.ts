import {
  GameResultResponseV2,
  GameControllerApiFactory,
  GameStartRequest,
  GameResultRequest,
  GameAnswerCheckRequest,
  Class01APIV2ApiFactory
} from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const gameControllerApi = () =>
  GameControllerApiFactory(undefined, "", requestAPI());
const gameControllerApiV2 = () =>
  Class01APIV2ApiFactory(undefined, "", requestAPI());

export const getHighlightListUsingPOST = async (params: GameStartRequest) => {
  const response = await gameControllerApi().getHighlightListUsingPOST(params);
  return response.data.body!;
};

export const isAnswerUsingPOST = async (params: GameAnswerCheckRequest) => {
  const response = await gameControllerApi().isAnswerUsingPOST(params);
  return response.data.body!;
};

export const gameResultUsingPOST = async (params: GameResultRequest) => {
  const response = await gameControllerApi().gameResultUsingPOST(params);
  return response.data.body!;
};

export const gameResultV2UsingPOST = async (params: GameResultRequest) => {
  const response = await gameControllerApiV2().gameResultUsingPOST1(params);
  return response.data;
};
