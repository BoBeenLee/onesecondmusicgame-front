import { RankingControllerApiFactory } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const rankingControllerApi = () =>
  RankingControllerApiFactory(undefined, "", requestAPI());

export const getRankingInfoUsingGET = async () => {
  const response = await rankingControllerApi().getRankingInfoUsingGET();
  return response.data.body;
};
