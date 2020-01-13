import qs from "qs";
import _ from "lodash";

export const makeQueryParams = <T>(search: string, defaultValue?: T) => {
  const response: T = qs.parse(_.defaultTo(search.substring(1), ""));
  if (_.isEmpty(response)) {
    return defaultValue!;
  }
  return response;
};
