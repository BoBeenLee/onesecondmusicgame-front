import _ from "lodash";
import { flow, types } from "mobx-state-tree";

import { singers } from "src/apis/singer";
import Singers from "src/stores/Singers";

const SingerStore = types
  .model("SingerStore", {
    singers: types.optional(Singers, {})
  })
  .actions(self => {
    const initialize = flow(function*() {
      const response: RetrieveAsyncFunc<typeof singers> = yield singers();
      self.singers = Singers.create({
        singers: response
      });
      self.singers.initialize({ q: "" });
    });

    return {
      initialize
    };
  });

export type ISingerStore = typeof SingerStore.Type;
export default SingerStore;
