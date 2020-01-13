import qs from "qs";
import _ from "lodash";

export const makeQueryParams = <T>(search: string, defaultValue?: T) => {
  return (qs.parse(_.defaultTo(search.substring(1), "")) || defaultValue) as T;
};
