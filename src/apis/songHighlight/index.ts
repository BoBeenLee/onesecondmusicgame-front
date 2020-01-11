import { SongHighlightControllerApiFactory } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";
import _ from "lodash";

export const songHighlightControllerApi = SongHighlightControllerApiFactory(
  undefined,
  requestAPI,
  ""
);

export const makeSongHighlightByTrackId = async (
  trackId: number
): Promise<any> => {
  const response = await songHighlightControllerApi.makeHighlightUsingPOST(
    trackId
  );
  return response.body;
};
