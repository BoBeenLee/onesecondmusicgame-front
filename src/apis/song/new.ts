import { requestAPI } from "src/configs/requestAPI";

interface IVariables {
  highlightSeconds: number[];
  singerName: string;
  title: string;
  url: string;
}

export const newSong = async (data: IVariables) => {
  await requestAPI({
    method: "post",
    url: "/song/new",
    data
  });
};
