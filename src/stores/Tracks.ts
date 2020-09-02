import _ from "lodash";
import { flow, types } from "mobx-state-tree";

import { getAllSongsBySingerNameUsingGET } from "src/apis/singer";
import Song from "src/stores/model/Song";

interface IVariables {
  q: string;
}

const DEFAULT_PAGE_SIZE = 30;

const Tracks = types
  .model("Tracks", {
    from: types.optional(types.number, 0),
    size: types.optional(types.number, DEFAULT_PAGE_SIZE),
    isRefresh: types.optional(types.boolean, false),
    tracks: types.optional(types.map(Song), {}),
    totalCount: types.optional(types.number, 0),
    variables: types.optional(types.frozen<IVariables>(), {
      q: ""
    })
  })
  .views(self => {
    return {
      get hasMore() {
        return self.from * self.size <= self.totalCount;
      },
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
      const response: RetrieveAsyncFunc<typeof getAllSongsBySingerNameUsingGET> = yield getAllSongsBySingerNameUsingGET(
        self.variables.q,
        self.from,
        self.size
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
      self.totalCount = response.totalElements ?? 0;
    });

    const initialize = flow(function*(variables: IVariables) {
      self.variables = variables;
      self.from = 0;
      clear();
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
      if (!self.hasMore) {
        return;
      }
      self.from += 1;
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
    return {
      search: self.initialize
    };
  });

export type ITracks = typeof Tracks.Type;

export default Tracks;
