import { requestAPI } from "src/configs/requestAPI";

interface IVariables {
  accessId: string;
  password: string;
}

interface IResponse {}

export const login = async (data: IVariables) => {
  const response: IResponse = await requestAPI({
    method: "post",
    url: "/user/login",
    data
  });
  return response;
};
