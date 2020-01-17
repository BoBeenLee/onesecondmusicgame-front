import _ from "lodash";
import { flow, types } from "mobx-state-tree";

import { singers, ISinger } from "src/apis/singer";

const SingerStore = types
  .model("SingerStore", {
    singers: types.optional(types.array(types.frozen<ISinger>()), [])
  })
  .actions(self => {
    const initialize = flow(function*() {
      const response: RetrieveAsyncFunc<typeof singers> = yield singers();
      self.singers.replace(response);
    });

    return {
      initialize
    };
  });

export type ISingerStore = typeof SingerStore.Type;
export default SingerStore;
