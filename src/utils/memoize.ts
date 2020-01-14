import _ from "lodash";
import memoizeOne from "memoize-one";
import isEqual from "react-fast-compare";

export const deepMemoize = <A, R>(func: (args: A) => R): ((args: A) => R) => {
  return memoizeOne(func as any, isEqual);
};

export const cachedMemoize = <A, R>(func: (args: A) => R) => {
  let memoize = deepMemoize(_.partial(func));
  return (isNotResetFunc: boolean) => {
    if (!isNotResetFunc) {
      memoize = deepMemoize(_.partial(func));
      return memoize;
    }
    return memoize;
  };
};
