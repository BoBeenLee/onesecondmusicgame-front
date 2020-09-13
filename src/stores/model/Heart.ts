import moment, { Moment } from "moment";
import { flow, types } from "mobx-state-tree";
import { checkMyHeartUsingGET, useHeartUsingPUT } from "src/apis/heart";
import { delay } from "src/utils/common";
import _ from "lodash";
import { today, secondsDuration } from "src/utils/date";

const Heart = types
  .model("Heart", {
    heartCount: types.optional(types.number, 0),
    leftTime: types.frozen<Moment | null>(null)
  })
  .views(self => {
    return {
      get isLackHeartCount() {
        return self.heartCount === 0;
      },
      get leftTimeSeconds() {
        if (self.leftTime === null) {
          return 0;
        }
        const diffSeconds = secondsDuration(today(), self.leftTime);
        return diffSeconds > 0 ? _.floor(diffSeconds) : 0;
      }
    };
  })
  .actions(self => {
    const fetchHeart = flow(function*() {
      const response: RetrieveAsyncFunc<typeof checkMyHeartUsingGET> = yield checkMyHeartUsingGET();
      self.heartCount = response.heartCount ?? 0;
      self.leftTime = today().add(response.leftTime ?? 0, "seconds");
    });

    const useHeart = flow(function*() {
      if (self.heartCount === 0) {
        return;
      }
      const response: RetrieveAsyncFunc<typeof useHeartUsingPUT> = yield useHeartUsingPUT();
      self.heartCount = response.heartCount ?? 0;
      self.leftTime = today().add(response.leftTime ?? 0, "seconds");
    });

    return {
      fetchHeart,
      useHeart
    };
  });

export type IHeart = typeof Heart.Type;

export default Heart;
