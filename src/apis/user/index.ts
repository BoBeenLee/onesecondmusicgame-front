import {
  MusicUserControllerApiFactory,
  UserLoginRequest,
  ResponseDTO
} from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

export const userControllerApi = MusicUserControllerApiFactory(
  undefined,
  requestAPI,
  ""
);

export interface IUserLoginResponse extends ResponseDTO {
  body: {
    token: string;
    nickname: string;
  };
}

export const signInUsingPOST = async (request: UserLoginRequest) => {
  return (await userControllerApi.signInUsingPOST(request)) as Promise<
    IUserLoginResponse
  >;
};
