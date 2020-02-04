import { RankingControllerApiFetchParamCreator } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const rankingControllerApi = RankingControllerApiFetchParamCreator(
  undefined,
  requestAPI,
  ""
);

export const getRankingInfo = async () => {
  const response = await rankingControllerApi.getRankingInfoUsingGET();
  return response.body ?? [];
};
