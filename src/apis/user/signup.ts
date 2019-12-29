import { requestAPI } from "src/configs/requestAPI";

interface IVariables {
  accessId: string;
  nickname: string;
  password: string;
}

interface IResponse {}

export const signup = async (data: IVariables) => {
  const response: IResponse = await requestAPI({
    method: "post",
    url: "/user/signup",
    data
  });
  return response;
};
