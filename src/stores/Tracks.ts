import _ from "lodash";
import { flow, types } from "mobx-state-tree";

import {
  getAllSongsBySingerNameUsingGET,
  getTrackListBySingerName
} from "src/apis/singer";
import Song from "src/stores/model/Song";

interface IVariables {
  q: string;
}

const TRACKS_LIMIT = 100;
const COMMENT_COUNT_LIMIT = 10;

const Tracks = types
  .model("Tracks", {
    from: types.optional(types.number, 0),
    isRefresh: types.optional(types.boolean, false),
    tracks: types.optional(types.map(Song), {}),
    variables: types.optional(types.frozen<IVariables>(), {
      q: ""
    })
  })
  .views(self => {
    return {
      get trackViews() {
        return Array.from(self.tracks.values());
      }
    };
  })
  .actions(self => {
    const clear = () => {
      self.from = 0;
      self.isRefresh = false;
      self.tracks.clear();
    };

    const fetch = flow(function*() {
      const response: RetrieveAsyncFunc<typeof getTrackListBySingerName> = yield getTrackListBySingerName(
        self.variables.q
      );
      for (const track of response) {
        self.tracks.set(
          String(track.id),
          Song.create({
            artworkUrl:
              (track as any).artwork_url ?? "https://via.placeholder.com/150",
            like: (track as any).comment_count ?? 0,
            singer: self.variables.q,
            title: track.title ?? "",
            trackId: String(track.id),
            url: (track as any).stream_url ?? ""
          })
        );
      }
    });

    const initialize = flow(function*(variables: IVariables) {
      self.variables = variables;
      self.from = 0;
      clear();
      const response: RetrieveAsyncFunc<typeof getAllSongsBySingerNameUsingGET> = yield getAllSongsBySingerNameUsingGET(
        self.variables.q,
        self.from,
        30
      );
      for (const track of response?.content ?? []) {
        self.tracks.set(
          String(track.trackId),
          Song.create({
            artworkUrl: track.artworkUrl ?? "",
            like: 0,
            singer: track.singer ?? "",
            title: track.title ?? "",
            trackId: String(track.trackId),
            url: track.url ?? ""
          })
        );
      }
      yield fetch();
    });

    const refresh = flow(function*() {
      if (self.isRefresh) {
        return;
      }
      self.isRefresh = true;
      clear();
      yield fetch();
      self.isRefresh = false;
    });

    const append = flow(function*() {
      if (self.from === 0) {
        return;
      }
      yield fetch();
    });

    return {
      append,
      clear,
      initialize,
      refresh
    };
  })
  .actions(self => {
    const debounceInitialize = _.debounce(self.initialize, 500);
    const search = flow(function*(variables: IVariables) {
      yield debounceInitialize(variables);
    });
    return {
      search
    };
  });

export type ITracks = typeof Tracks.Type;

export default Tracks;
