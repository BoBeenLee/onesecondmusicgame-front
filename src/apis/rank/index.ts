import { RankingControllerApiFactory } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const rankingControllerApi = () =>
  RankingControllerApiFactory(undefined, "", requestAPI());

export const getRankingInfoUsingGET = async () => {
  const response = await rankingControllerApi().getRankingInfoUsingGET();
  return response.data.body;
};

export const getRankingInfoOfMonthsUsingGET = async () => {
  const response = await rankingControllerApi().getRankingInfoOfMonthsUsingGET();
  return response.data.body;
};

export const getRankingInfoOfSeasonUsingGET = async () => {
  const response = await rankingControllerApi().getRankingInfoOfSeasonUsingGET();
  return response.data.body;
};
