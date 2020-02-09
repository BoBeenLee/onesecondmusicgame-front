import {
  LikeControllerApiFactory,
  LikeHistoryControllerApiFactory,
  LikeRequest
} from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const likeControllerApi = LikeControllerApiFactory(undefined, requestAPI, "");
const likeHistoryControllerApi = LikeHistoryControllerApiFactory(
  undefined,
  requestAPI,
  ""
);

export const likeUsingPOST = async (params: LikeRequest) => {
  const response = await likeControllerApi.likeUsingPOST(params);
  return response.body ?? [];
};

export const dislikeUsingPOST = async (params: LikeRequest) => {
  const response = await likeControllerApi.dislikeUsingPOST(params);
  return response.body ?? [];
};

export const getLikeHistoryUsingGET = async (trackId: number) => {
  const response = await likeHistoryControllerApi.getLikeHistoryUsingGET(
    trackId
  );
  return response.body;
};

export const getUserHistoryUsingGET = async (trackId: number) => {
  const response = await likeHistoryControllerApi.getUserHistoryUsingGET(
    trackId
  );
  return response.body;
};
