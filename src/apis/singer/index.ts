import _ from "lodash";

import { SingerControllerApiFactory, Singer } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const singerControllerApi = () =>
  SingerControllerApiFactory(undefined, "", requestAPI());

export interface ISinger extends Singer {
  singerName: string;
}

export const singers = async (): Promise<ISinger[]> => {
  const response = await singerControllerApi().getAllStandardSingerList();
  return _.map(response.data.body ?? [], item => ({
    singerName: item.singerName!,
    artworkUrl: item.artworkUrl
  }));
};

export const getTrackListBySingerName = async (name: string) => {
  const response = await singerControllerApi().getTrackListBySingerName(name);
  return response.data;
};

export const getAllSongsBySingerNameUsingGET = async (
  singerName: string,
  page: number,
  size: number
) => {
  const response = await singerControllerApi().getAllSongsBySingerName(
    singerName,
    page,
    size
  );
  return response.data.body!;
};

export const registeredSingers = async (): Promise<ISinger[]> => {
  const response = await singerControllerApi().getAllRegisteredSingerName();
  return _.map(response.data.body ?? [], item => ({
    singerName: item.singerName!,
    artworkUrl: item.artworkUrl
  }));
};
