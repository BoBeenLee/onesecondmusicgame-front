import _ from "lodash";
import { flow, types } from "mobx-state-tree";

import { singers, registeredSingers } from "src/apis/singer";
import Singers from "src/stores/Singers";

const SingerStore = types
  .model("SingerStore", {
    registeredSingers: types.optional(Singers, {}),
    allSingers: types.optional(Singers, {})
  })
  .actions(self => {
    const initialize = flow(function*() {
      const [responseRegisteredSingers, responseSingers]: [
        RetrieveAsyncFunc<typeof registeredSingers>,
        RetrieveAsyncFunc<typeof singers>
      ] = yield Promise.all([registeredSingers(), singers()]);
      self.registeredSingers = Singers.create({
        singers: responseRegisteredSingers
      });
      self.allSingers = Singers.create({
        singers: responseSingers
      });
      self.registeredSingers.initialize({ q: "" });
      self.allSingers.initialize({ q: "" });
    });

    return {
      initialize
    };
  });

export type ISingerStore = typeof SingerStore.Type;
export default SingerStore;
