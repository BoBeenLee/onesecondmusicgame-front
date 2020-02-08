import { reaction } from "mobx";
import { addDisposer, flow, types } from "mobx-state-tree";
import { checkMyHeartUsingGET, useHeartUsingPUT } from "src/apis/heart";
import { delay } from "src/utils/common";
import _ from "lodash";

const Heart = types
  .model("Heart", {
    heartCount: types.optional(types.number, 0),
    leftTime: types.optional(types.number, 0)
  })
  .actions(self => {
    const fetchHeart = flow(function*() {
      const response: RetrieveAsyncFunc<typeof checkMyHeartUsingGET> = yield checkMyHeartUsingGET();
      self.heartCount = response.heartCount ?? 0;
      self.leftTime = response.leftTime ?? 0;
    });

    const useHeart = flow(function*() {
      if (self.heartCount === 0) {
        return;
      }
      const response: RetrieveAsyncFunc<typeof useHeartUsingPUT> = yield useHeartUsingPUT();
      self.heartCount = response.heartCount ?? 0;
      self.leftTime = response.leftTime ?? 0;
    });
    return {
      fetchHeart,
      useHeart
    };
  })
  .actions(self => {
    const afterCreate = () => {
      const onVisible = reaction(
        () => self.leftTime,
        async (leftTime: number) => {
          if (leftTime === 0) {
            self.fetchHeart();
            return;
          }
          await delay(1000);
          self.leftTime -= 1;
        }
      );
      addDisposer(self, onVisible);
    };
    return {
      afterCreate
    };
  });

export type IHeart = typeof Heart.Type;

export default Heart;
