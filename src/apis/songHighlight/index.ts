import { SongHighlightControllerApiFactory } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";
import _ from "lodash";

const songHighlightControllerApi = () =>
  SongHighlightControllerApiFactory(undefined, "", requestAPI());

export const makeSongHighlightByTrackId = async (trackId: number) => {
  const response = await songHighlightControllerApi().makeHighlight(trackId);
  return response.data.body!;
};
