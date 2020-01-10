import _ from "lodash";
import { flow, types } from "mobx-state-tree";

import { tracks } from "src/apis/soundcloud/tracks";
import { ITrackItem } from "src/apis/soundcloud/interface";

interface IVariables {
  q: string;
}

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
        offset: self.from
      });
      self.from += response.length;
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
      if (_.isEmpty(self.from)) {
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
    const search = (variables: IVariables) => {
      self.initialize(variables);
    };
    return {
      search: _.debounce(search, 500)
    };
  });

export type ITracks = typeof Tracks.Type;

export default Tracks;
