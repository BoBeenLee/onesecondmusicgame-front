import { requestAPI } from "src/configs/requestAPI";

interface IVariables {
  accessId: string;
  nickname: string;
  password: string;
}

export const signup = async (data: IVariables) => {
  await requestAPI({
    method: "post",
    url: "/user/signup",
    data
  });
};
