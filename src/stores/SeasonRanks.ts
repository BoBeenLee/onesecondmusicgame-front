import _ from "lodash";
import { flow, types } from "mobx-state-tree";
import { getRankingInfoOfSeasonUsingGET } from "src/apis/rank";
import { RankView } from "__generate__/api";
import { secondsDuration, today } from "src/utils/date";

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
    lastSeasonTop3: types.optional(types.array(types.frozen<RankView>()), []),
    timeToFinishThisSeason: types.optional(types.number, 0),
    myRank: types.frozen<RankView | null>(null)
  })
  .views(self => {
    return {
      get rankViews() {
        return Array.from(self.ranks).map(item => {
          return {
            ...item,
            isMyRank: item.nickname === self.myRank?.nickname
          };
        });
      },
      get isMyRankIncludeRanks() {
        return this.rankViews.some(
          item => item.nickname === self.myRank?.nickname
        );
      },
      get finishThisSeasonFormat() {
        const remainSeconds = secondsDuration(
          today(),
          self.timeToFinishThisSeason
        );
        const minutes = _.ceil(remainSeconds / 60);
        const hours = _.ceil(minutes / 60);
        const days = _.ceil(hours / 24);
        return `종로까지 남은 시간 : ${days}일 ${hours % 24}시간 ${minutes %
          60}분`;
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
      self.timeToFinishThisSeason =
        (response?.timeToFinishThisSeason ?? 0) * 1000;
      self.myRank = response?.myRank ?? null;
      self.ranks.replace(response?.currentSeasonRanking?.rankViewList ?? []);
      self.lastSeasonTop3.replace(
        response?.currentSeasonRanking?.rankViewList ?? []
      );
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