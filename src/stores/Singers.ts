import _ from "lodash";
import { flow, types } from "mobx-state-tree";

import { singers, ISinger } from "src/apis/singer";

const mocks = [{ name: "a," }, { name: "b" }];

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
    const afterCreate = flow(function*() {
      const response: RetrieveAsyncFunc<typeof singers> = yield singers();
      self.singers.replace(response);
    });

    const clear = () => {
      self.isRefresh = false;
      self.singers.clear();
    };

    const fetch = flow(function*() {
      self.filterSingers.replace(
        self.singers.filter(item => {
          return Boolean(item.name.search(self.variables.q));
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
      afterCreate,
      clear,
      initialize,
      refresh
    };
  })
  .actions(self => {
    const search = (variables: IVariables) => {
      self.initialize(variables);
    };
    return {
      search: _.debounce(search, 500)
    };
  });

export type ISingers = typeof Singers.Type;

export default Singers;
