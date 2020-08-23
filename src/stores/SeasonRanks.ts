import { flow, types } from "mobx-state-tree";
import {
  getRankingInfoUsingGET,
  getRankingInfoOfSeasonUsingGET
} from "src/apis/rank";
import { RankView } from "__generate__/api";

export interface ISeasonRankItem {
  nickname: string;
  point: number;
  rankDiff: number;
  profileImageUrl: string;
}

const SeasonRanks = types
  .model("SeasonRanks", {
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
      const response: RetrieveAsyncFunc<typeof getRankingInfoOfSeasonUsingGET> = yield getRankingInfoOfSeasonUsingGET();
      self.time = (response?.time ?? 0) * 1000;
      self.ranks.replace(response?.rankViewList ?? []);
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

export type ISeasonRanks = typeof SeasonRanks.Type;

export default SeasonRanks;
