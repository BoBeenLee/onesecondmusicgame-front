import { requestAPI } from "src/configs/requestAPI";

interface IVariables {
  accessId: string;
  password: string;
}

export const login = async (data: IVariables) => {
  await requestAPI({
    method: "post",
    url: "/user/login",
    data
  });
};
