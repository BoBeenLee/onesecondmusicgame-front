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
    const initializeSingers = flow(function*() {
      const responseSingers: RetrieveAsyncFunc<typeof singers> = yield singers();
      self.allSingers = Singers.create({
        singers: responseSingers
      });
      self.allSingers.initialize({ q: "" });
    });

    const initializeRegisteredSingers = flow(function*() {
      const responseRegisteredSingers: RetrieveAsyncFunc<typeof registeredSingers> = yield registeredSingers();
      self.registeredSingers = Singers.create({
        singers: responseRegisteredSingers
      });
      self.registeredSingers.initialize({ q: "" });
    });

    return {
      initializeSingers,
      initializeRegisteredSingers
    };
  });

export type ISingerStore = typeof SingerStore.Type;
export default SingerStore;
