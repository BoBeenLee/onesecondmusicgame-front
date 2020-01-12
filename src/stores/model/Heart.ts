import { flow, types } from "mobx-state-tree";

import { heartControllerApi, checkMyHeartUsingGET } from "src/apis/heart";

const INTERVAL_THREE_MINUTES = 180000;

const Heart = types
  .model("Heart", {
    heartCount: types.optional(types.number, 0)
  })
  .actions(self => {
    const fetchHeart = flow(function*() {
      const response: RetrieveAsyncFunc<typeof checkMyHeartUsingGET> = yield checkMyHeartUsingGET();
      self.heartCount = response.body.heartCount;
    });

    const useHeart = flow(function*() {
      if (self.heartCount === 0) {
        return;
      }
      yield heartControllerApi.useHeartUsingPUT();
      self.heartCount -= 1;
    });
    return {
      fetchHeart,
      useHeart
    };
  })
  .actions(self => {
    const afterCreate = () => {
      setInterval(self.fetchHeart, INTERVAL_THREE_MINUTES);
    };
    return {
      afterCreate
    };
  });

export type IHeart = typeof Heart.Type;

export default Heart;
