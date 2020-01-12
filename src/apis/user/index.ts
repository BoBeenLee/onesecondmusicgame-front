import {
  MusicUserControllerApiFactory,
  UserLoginRequest,
  UserSignUpRequest
} from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const userControllerApi = MusicUserControllerApiFactory(
  undefined,
  requestAPI,
  ""
);

export const signInUsingPOST = async (request: UserLoginRequest) => {
  const response = await userControllerApi.signInUsingPOST(request);
  return response.body!;
};

export const signUpUsingPOST = async (request: UserSignUpRequest) => {
  const response = await userControllerApi.signUpUsingPOST(request);
  return response.body!;
};