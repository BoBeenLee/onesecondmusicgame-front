import {
  SongHighlightControllerApiFactory,
  SongHighlightAddRequest
} from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";
import _ from "lodash";

const songHighlightControllerApi = () =>
  SongHighlightControllerApiFactory(undefined, "", requestAPI());

export const makeSongHighlightByTrackId = async (trackId: number) => {
  const response = await songHighlightControllerApi().makeHighlight(trackId);
  return response.data.body!;
};

export const addSongHighlight = async (
  songHighlightAddRequest: SongHighlightAddRequest
) => {
  const response = await songHighlightControllerApi().addSongHighlight(
    songHighlightAddRequest
  );
  return response.data.body!;
};
