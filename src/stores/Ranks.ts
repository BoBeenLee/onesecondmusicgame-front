import _ from "lodash";
import { flow, types } from "mobx-state-tree";

export interface IRankItem {
  rank: number;
  name: string;
  profileImage: string;
  score: number;
}

const mocks: IRankItem[] = [
  {
    rank: 1,
    profileImage: "https://via.placeholder.com/350x350",
    name: "jasmin",
    score: 83
  },
  {
    rank: 2,
    profileImage: "https://via.placeholder.com/350x350",
    name: "jasmin",
    score: 83
  },
  {
    rank: 3,
    profileImage: "https://via.placeholder.com/350x350",
    name: "jasmin",
    score: 83
  },
  {
    rank: 4,
    profileImage: "https://via.placeholder.com/350x350",
    name: "jasmin",
    score: 83
  }
];

const Ranks = types
  .model("Ranks", {
    isRefresh: types.optional(types.boolean, false),
    ranks: types.optional(types.array(types.frozen<IRankItem>()), mocks)
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
      // const response: RetrieveAsyncFunc<typeof singers> = yield singers();
      self.ranks.replace(mocks);
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

export type ISingers = typeof Ranks.Type;

export default Ranks;
