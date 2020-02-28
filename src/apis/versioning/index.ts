import { VersioningControllerApiFactory } from "__generate__/api";
import { requestAPI } from "src/configs/requestAPI";

const versioningKeywordControllerApi = VersioningControllerApiFactory(
  undefined,
  requestAPI,
  ""
);

interface IVersioningKeywordRequest {
  os: string;
  version: string;
}

export const isNeedForceUpdateUsingGET = async (
  request: IVersioningKeywordRequest
) => {
  const response = await versioningKeywordControllerApi.isNeedForceUpdateUsingGET(
    request.os,
    request.version
  );
  return response.body!;
};
