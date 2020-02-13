import _ from "lodash";
import { flow, types } from "mobx-state-tree";

import { tracks } from "src/apis/soundcloud/tracks";
import { ITrackItem } from "src/apis/soundcloud/interface";

interface IVariables {
  q: string;
}

const TRACKS_LIMIT = 20;

const Tracks = types
  .model("Tracks", {
    from: types.optional(types.number, 0),
    isRefresh: types.optional(types.boolean, false),
    tracks: types.optional(types.map(types.frozen<ITrackItem>()), {}),
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
      const response: RetrieveAsyncFunc<typeof tracks> = yield tracks({
        ...self.variables,
        offset: self.from,
        limit: TRACKS_LIMIT
      });
      self.from = response.length !== 0 ? self.from + response.length : 0;
      for (const track of response) {
        self.tracks.set(String(track.id), track);
      }
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
