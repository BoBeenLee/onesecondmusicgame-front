import { soundCloudAPI } from "src/configs/soundCloudAPI";
import { IUser } from "src/apis/soundcloud/interface";

interface IVariables {
  id: string;
}

interface IResponse {
  comment_count: number;
  downloadable: boolean;
  release: string;
  created_at: string;
  description: string;
  original_content_size: number;
  title: string;
  track_type: string;
  duration: number;
  video_url: any;
  original_format: string;
  artwork_url: string;
  streamable: boolean;
  tag_list: string;
  release_month: any;
  genre: string;
  release_day: any;
  download_url: string;
  id: number;
  state: string;
  reposts_count: number;
  last_modified: string;
  label_name: string;
  commentable: boolean;
  bpm: any;
  favoritings_count: number;
  kind: string;
  purchase_url: string;
  release_year: any;
  key_signature: string;
  isrc: string;
  sharing: string;
  uri: string;
  download_count: number;
  license: string;
  purchase_title: string;
  user_id: number;
  embeddable_by: string;
  waveform_url: string;
  permalink: string;
  permalink_url: string;
  user: IUser;
  label_id: any;
  stream_url: string;
  playback_count: number;
}

export const tracksById = async (data: IVariables) => {
  return await soundCloudAPI<IResponse>({
    method: "get",
    url: `/tracks/${data.id}`
  });
};
