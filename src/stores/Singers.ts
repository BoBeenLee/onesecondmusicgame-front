import _ from "lodash";
import { flow, types } from "mobx-state-tree";

import { singers, ISinger } from "src/apis/singer";

const Singers = types
  .model("Singers", {
    isRefresh: types.optional(types.boolean, false),
    singers: types.optional(types.array(types.frozen<ISinger>()), [])
  })
  .views(self => {
    return {
      get singerViews() {
        return self.singers;
      }
    };
  })
  .actions(self => {
    const clear = () => {
      self.isRefresh = false;
      self.singers.clear();
    };

    const fetch = flow(function*() {
      const response: RetrieveAsyncFunc<typeof singers> = yield singers();
      self.singers.replace(response);
    });

    const initialize = flow(function*() {
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

    return {
      clear,
      initialize,
      refresh
    };
  });

export type ISingers = typeof Singers.Type;

export default Singers;
