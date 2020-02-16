import _ from "lodash";

import { SingerControllerApiFactory } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const singerControllerApi = SingerControllerApiFactory(
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

export const getAllSongsBySingerNameUsingGET = async (
  singerName: string,
  page: number,
  size: number
) => {
  const response = await singerControllerApi.getAllSongsBySingerNameUsingGET(
    singerName,
    page,
    size
  );
  return response.body!;
};

export const registeredSingers = async (): Promise<ISinger[]> => {
  const response = await singerControllerApi.getAllRegisteredSingerNameUsingGET();
  return _.map(response.body, name => ({ name }));
};
