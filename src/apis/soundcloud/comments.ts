/* eslint-disable @typescript-eslint/no-explicit-any */
import { soundCloudAPI } from "src/configs/soundCloudAPI";
import { IUser } from "src/apis/soundcloud/interface";

interface IVariables {
  trackId: string;
}

export interface ICommentItem {
  kind: string;
  id: number;
  created_at: string;
  user_id: number;
  track_id: number;
  timestamp: number;
  body: string;
  uri: string;
  user: IUser;
}

export const commentsByTrackId = async ({ trackId }: IVariables) => {
  return await soundCloudAPI<ICommentItem>({
    method: "get",
    url: `/comments/${trackId}`
  });
};
