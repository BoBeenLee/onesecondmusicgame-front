import _ from "lodash";
import { flow, types } from "mobx-state-tree";

import { getRankingInfo } from "src/apis/rank";

export interface IRankItem {
  nickname: string;
  point: number;
  rankDiff: number;
}

const Ranks = types
  .model("Ranks", {
    isRefresh: types.optional(types.boolean, false),
    ranks: types.optional(types.array(types.frozen<IRankItem>()), [])
  })
  .views(self => {
    return {
      get rankViews() {
        return Array.from(self.ranks);
      }
    };
  })
  .actions(self => {
    const clear = () => {
      self.isRefresh = false;
      self.ranks.clear();
    };

    const fetch = flow(function*() {
      const response: RetrieveAsyncFunc<typeof singers> = yield getRankingInfo();
      return response.rankViewList;
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

export type IRanks = typeof Ranks.Type;

export default Ranks;
