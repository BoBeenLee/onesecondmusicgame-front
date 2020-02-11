import {
  MusicUserControllerApiFactory,
  UserLoginRequest,
  UserSignUpRequest,
  NicknameChangeRequest,
  ResponseDTOstring
} from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";
import upload from "src/configs/upload";
import env from "src/configs/env";
import { resizeImageByURI } from "src/configs/image";

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

export const myInfoChangeUsingPUT = async (request: NicknameChangeRequest) => {
  const response = await userControllerApi.myInfoChangeUsingPUT(request);
  return response.body!;
};

export const myInfoChangeUsingPOST = async (filePath: string) => {
  const resizeResponse = await resizeImageByURI(filePath, 100);
  await upload({
    fileExtension: "PNG",
    filePath: resizeResponse.uri,
    fileName: "profileImage",
    uri: `${env.API_URL}/user/profile/dp`
  });
};
