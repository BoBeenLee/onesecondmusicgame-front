import { flow, types } from "mobx-state-tree";

import { heartControllerApi, checkMyHeartUsingGET } from "src/apis/heart";

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
      yield heartControllerApi.useHeartUsingPUT();
      self.heartCount -= 1;
    });
    return {
      fetchHeart,
      useHeart
    };
  });

export type IHeart = typeof Heart.Type;

export default Heart;
