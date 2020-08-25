import { RewardControllerApiFactory } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const rewardControllerApi = () =>
  RewardControllerApiFactory(undefined, "", requestAPI());

export enum RewardType {
  AdMovie = "ad_movie",
  SuggestMusic = "suggest_music"
}

export const rewardForWatchingAdUsingPOST = async (type: RewardType) => {
  const response = await rewardControllerApi().rewardForWatchingAd(type);
  return response.data.body;
};
