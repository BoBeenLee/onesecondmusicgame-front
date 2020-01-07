import _ from "lodash";

import { SingerControllerApiFactory } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

export const singerControllerApi = SingerControllerApiFactory(
  undefined,
  requestAPI,
  ""
);

export interface ISinger {
  name: string;
}

export const singers = async (): Promise<ISinger[]> => {
  const response = await singerControllerApi.getAllSingerNameUsingGET();
  return _.map(response.body, name => ({ name }));
};
