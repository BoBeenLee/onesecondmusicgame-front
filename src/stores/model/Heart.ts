import { reaction } from "mobx";
import { addDisposer, flow, types } from "mobx-state-tree";
import {
  heartControllerApi,
  checkMyHeartUsingGET,
  useHeartUsingPUT
} from "src/apis/heart";
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
      self.heartCount = response.body.heartCount;
      self.leftTime = response.body.leftTime;
    });

    const useHeart = flow(function*() {
      if (self.heartCount === 0) {
        return;
      }
      const response: RetrieveAsyncFunc<typeof useHeartUsingPUT> = yield useHeartUsingPUT();
      self.heartCount = response.body.heartCount;
      self.leftTime = response.body.leftTime;
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
          if (leftTime > 0) {
            await delay(leftTime * 1000);
            self.fetchHeart();
          }
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
