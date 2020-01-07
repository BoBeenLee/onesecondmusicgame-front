import { RewardControllerApiFactory } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

export const rewardControllerApi = RewardControllerApiFactory(
  undefined,
  requestAPI,
  ""
);

export enum RewardType {
  AdMovie = "ad_movie",
  SuggestMusic = "suggest_music"
}

export const rewardForWatchingAdUsingPOST = async (rewardType: RewardType) => {
  await rewardControllerApi.rewardForWatchingAdUsingPOST(rewardType);
};
