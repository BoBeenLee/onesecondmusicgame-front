export interface IUser {
  id: number;
  kind: string;
  permalink: string;
  username: string;
  last_modified: string;
  uri: string;
  permalink_url: string;
  avatar_url: string;
}

export interface ITrackItem {
  artwork_url?: string;
  bpm: any;
  comment_count: number;
  commentable: boolean;
  created_at: string;
  description?: string;
  download_count: number;
  download_url?: string;
  downloadable: boolean;
  duration: number;
  embeddable_by: string;
  favoritings_count: number;
  genre: string;
  id: number;
  isrc?: string;
  key_signature: string;
  kind: string;
  label_id: any;
  label_name?: string;
  last_modified: string;
  license: string;
  likes_count: number;
  original_content_size: number;
  original_format: string;
  permalink_url: string;
  permalink: string;
  playback_count: number;
  purchase_title?: string;
  purchase_url?: string;
  release_day?: number;
  release_month?: number;
  release_year?: number;
  release: string;
  reposts_count: number;
  sharing: string;
  state: string;
  stream_url: string;
  streamable: boolean;
  tag_list: string;
  title: string;
  track_type?: string;
  uri: string;
  user_favorite: boolean;
  user_id: number;
  user_playback_count: any;
  user: IUser;
  video_url?: string;
  waveform_url: string;
}

export interface ITrackCommentItem {
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

export interface ITracks {
  comment_count: number;
  full_duration: number;
  downloadable: boolean;
  created_at: string;
  description: string;
  media: Media;
  title: string;
  publisher_metadata: any;
  duration: number;
  has_downloads_left: boolean;
  artwork_url: string;
  public: boolean;
  streamable: boolean;
  tag_list: string;
  genre: string;
  id: number;
  reposts_count: number;
  state: string;
  label_name: any;
  last_modified: string;
  commentable: boolean;
  policy: string;
  visuals: any;
  kind: string;
  purchase_url: any;
  sharing: string;
  uri: string;
  secret_token: any;
  download_count: number;
  likes_count: number;
  urn: string;
  license: string;
  purchase_title: any;
  display_date: string;
  embeddable_by: string;
  release_date: any;
  user_id: number;
  monetization_model: string;
  waveform_url: string;
  permalink: string;
  permalink_url: string;
  user: User;
  playback_count: number;
}

export interface Media {
  transcodings: Transcoding[];
}

export interface Transcoding {
  url: string;
  preset: string;
  duration: number;
  snipped: boolean;
  format: Format;
  quality: string;
}

export interface Format {
  protocol: string;
  mime_type: string;
}

export interface User {
  avatar_url: string;
  first_name: string;
  full_name: string;
  id: number;
  kind: string;
  last_modified: string;
  last_name: string;
  permalink: string;
  permalink_url: string;
  uri: string;
  urn: string;
  username: string;
  verified: boolean;
  city: any;
  country_code: any;
}
