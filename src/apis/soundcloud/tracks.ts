import { soundCloudAPI } from "src/configs/soundCloudAPI";
import { IUser } from "src/apis/soundcloud/interface";

interface IVariables {
  limit?: number;
  offset?: number;
  tags?: string;
  q?: string;
}

interface IResponse {
  collection: Collection[];
  next_href: string;
}

interface Collection {
  id: number;
  kind: string;
  created_at: string;
  last_modified: string;
  permalink: string;
  permalink_url: string;
  title: string;
  duration: number;
  sharing: string;
  waveform_url: string;
  stream_url: string;
  uri: string;
  user_id: number;
  artwork_url?: string;
  comment_count: number;
  commentable: boolean;
  description?: string;
  download_count: number;
  downloadable: boolean;
  embeddable_by: string;
  favoritings_count: number;
  genre: string;
  isrc?: string;
  label_id: any;
  label_name?: string;
  license: string;
  original_content_size: number;
  original_format: string;
  playback_count: number;
  purchase_title?: string;
  purchase_url?: string;
  release: string;
  release_day?: number;
  release_month?: number;
  release_year?: number;
  reposts_count: number;
  state: string;
  streamable: boolean;
  tag_list: string;
  track_type?: string;
  user: IUser;
  likes_count: number;
  bpm: any;
  key_signature: string;
  user_favorite: boolean;
  user_playback_count: any;
  video_url?: string;
  download_url?: string;
}

export const tracks = async ({
  limit = 20,
  offset = 0,
  tags,
  q
}: IVariables) => {
  return await soundCloudAPI<IResponse>({
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
