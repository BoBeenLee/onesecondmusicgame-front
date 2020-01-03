import { requestAPI } from "src/configs/requestAPI";

interface IVariables {
  highlightSeconds: number[];
  songId: number;
}

export const highlightNew = async (data: IVariables) => {
  await requestAPI({
    method: "post",
    url: "/song/highlight/new",
    data
  });
};
