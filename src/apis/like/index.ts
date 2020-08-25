import {
  LikeControllerApiFactory,
  LikeHistoryControllerApiFactory,
  LikeRequest
} from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const likeControllerApi = () =>
  LikeControllerApiFactory(undefined, "", requestAPI());
const likeHistoryControllerApi = () =>
  LikeHistoryControllerApiFactory(undefined, "", requestAPI());

export const likeUsingPOST = async (params: LikeRequest) => {
  const response = await likeControllerApi().like(params);
  return response.data.body ?? [];
};

export const dislikeUsingPOST = async (params: LikeRequest) => {
  const response = await likeControllerApi().dislike(params);
  return response.data.body ?? [];
};

export const getLikeHistoryUsingGET = async (trackId: number) => {
  const response = await likeHistoryControllerApi().getLikeHistory(trackId);
  return response.data.body;
};

export const getUserHistoryUsingGET = async () => {
  const response = await likeHistoryControllerApi().getUserHistory();
  return response.data.body;
};
