import { flow, types } from "mobx-state-tree";
import {
  getRankingInfoUsingGET,
  getRankingInfoOfMonthsUsingGET
} from "src/apis/rank";
import { RankView } from "__generate__/api";

export interface IMonthlyRankItem {
  nickname: string;
  point: number;
  rankDiff: number;
  profileImageUrl: string;
}

const MonthlyRanks = types
  .model("MonthlyRanks", {
    isRefresh: types.optional(types.boolean, false),
    ranks: types.optional(types.array(types.frozen<RankView>()), []),
    time: types.optional(types.number, 0)
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
      const response: RetrieveAsyncFunc<typeof getRankingInfoOfMonthsUsingGET> = yield getRankingInfoOfMonthsUsingGET();
      self.time = (response?.currentMonthlyRanking?.time ?? 0) * 1000;
      self.ranks.replace(response?.currentMonthlyRanking?.rankViewList ?? []);
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

export type IMonthlyRanks = typeof MonthlyRanks.Type;

export default MonthlyRanks;
