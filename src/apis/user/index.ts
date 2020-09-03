import {
  MusicUserControllerApiFactory,
  UserLoginRequest,
  UserSignUpRequest,
  NicknameChangeRequest
} from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";
import upload from "src/configs/upload";
import env from "src/configs/env";
import { resizeImageByURI } from "src/configs/image";

const userControllerApi = () =>
  MusicUserControllerApiFactory(undefined, "", requestAPI());

export const signInUsingPOST = async (request: UserLoginRequest) => {
  const response = await userControllerApi().signIn(request);
  return response.data.body!;
};

export const signUpUsingPOST = async (request: UserSignUpRequest) => {
  const response = await userControllerApi().signUp(request);
  return response.data.body!;
};

export const myInfoChangeUsingPUT = async (request: NicknameChangeRequest) => {
  const response = await userControllerApi().myInfoChange1(request);
  return response.data.body!;
};

export const myInfoChangeUsingPOST = async (filePath: string) => {
  const resizeResponse = await resizeImageByURI(filePath, 100);
  const response = await upload({
    fileExtension: "PNG",
    filePath: resizeResponse.uri,
    fileName: "profileImage",
    uri: `${env.API_URL}/user/profile/dp`
  });
  return response.body!;
};
