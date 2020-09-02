import _ from "lodash";
import { flow, types } from "mobx-state-tree";

import { singers, ISinger } from "src/apis/singer";
import { includesForSearch } from "src/utils/string";

const mocks = [{ singerName: "a," }, { singerName: "b" }];

interface IVariables {
  q: string;
}

const Singers = types
  .model("Singers", {
    isRefresh: types.optional(types.boolean, false),
    singers: types.optional(types.array(types.frozen<ISinger>()), mocks),
    filterSingers: types.optional(types.array(types.frozen<ISinger>()), mocks),
    variables: types.optional(types.frozen<IVariables>(), {
      q: ""
    })
  })
  .views(self => {
    return {
      get singerViews() {
        return Array.from(self.filterSingers);
      }
    };
  })
  .actions(self => {
    const clear = () => {
      self.isRefresh = false;
      self.filterSingers.clear();
    };

    const fetch = flow(function*() {
      self.filterSingers.replace(
        self.singers.filter(item => {
          return includesForSearch(item.singerName, self.variables.q);
        })
      );
    });

    const initialize = flow(function*(variables: IVariables) {
      self.variables = variables;
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
  })
  .actions(self => {
    const debounceInitialize = _.debounce(self.initialize, 500);
    const search = flow(function*(variables: IVariables) {
      yield debounceInitialize(variables);
    });
    return {
      search
    };
  });

export type ISingers = typeof Singers.Type;

export default Singers;
