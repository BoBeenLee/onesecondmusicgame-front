import { HeartControllerApiFactory, ResponseDTO } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

export const heartControllerApi = HeartControllerApiFactory(
  undefined,
  requestAPI,
  ""
);

export interface ICheckHeartResponse extends ResponseDTO {
  body: {
    heartCount: number;
  };
}

export const checkMyHeartUsingGET = async () => {
  return (await heartControllerApi.checkMyHeartUsingGET()) as Promise<
    ICheckHeartResponse
  >;
};
