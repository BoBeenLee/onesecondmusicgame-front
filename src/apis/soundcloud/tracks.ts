/* eslint-disable @typescript-eslint/no-explicit-any */
import { soundCloudAPI } from "src/configs/soundCloudAPI";
import { ITrackItem, ITrackCommentItem } from "src/apis/soundcloud/interface";

interface ITracksVariables {
  limit?: number;
  offset?: number;
  tags?: string;
  q?: string;
}

export const tracks = async ({
  limit = 20,
  offset = 0,
  tags,
  q
}: ITracksVariables) => {
  return await soundCloudAPI<ITrackItem[]>({
    method: "get",
    url: `/tracks`,
    params: {
      limit,
      offset,
      tags,
      q
    }
  });
};

interface ITracksByIdVariables {
  id: string;
}

export const tracksById = async (data: ITracksByIdVariables) => {
  return await soundCloudAPI<ITrackItem>({
    method: "get",
    url: `/tracks/${data.id}`
  });
};

interface ITracksCommentsByIdVariables {
  trackId: string;
}

export const tracksCommentsByTrackId = async (
  data: ITracksCommentsByIdVariables
) => {
  return await soundCloudAPI<ITrackCommentItem[]>({
    method: "get",
    url: `/tracks/${data.trackId}/comments`
  });
};
