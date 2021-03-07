import _ from "lodash";
import RNFetchBlob from "rn-fetch-blob";
import env from "src/configs/env";
import { getRootStore } from "src/stores/Store";
import { OSMGError } from "src/configs/error";

type ImageExtensionType = "JPG" | "JPEG" | "PNG";
type VideoExtensionType = "MP4" | "M4V" | "MKV" | "AVI" | "MOV";
export type FileExtensionType = ImageExtensionType | VideoExtensionType;

export interface IUploadInput {
  fileExtension: FileExtensionType;
  filePath: string;
  fileName: string;
  uri: string;
}

interface IFetchBlobResponse {
  info: () => any;
  json: () => any;
  type: string;
  taskId: string;
  respInfo: any;
}

interface IFetchInfoResponse {
  state: string;
  status: number;
  taskId: string;
  timeout: boolean;
}

const NORMAL_STATUS = 200;
const NORMAL_STATUS_ = 2000;
const PROGRESS_INTERVAL = 250;

const METHOD_TYPE = "POST";

const readyForUpload = (params: IUploadInput) => {
  const { filePath, fileName, uri } = params;
  const cleanFilePath = filePath.replace("file://", "");

  const userAccessToken = getRootStore().authStore.user?.userAccessToken;
  const responsePromise: Promise<IFetchBlobResponse> = RNFetchBlob.fetch(
    METHOD_TYPE,
    uri,
    {
      ...(userAccessToken ? { token: userAccessToken } : {}),
      "Content-Type": "multipart/form-data",
      method: METHOD_TYPE
    },
    [
      {
        name: fileName,
        filename: `${fileName}.png`,
        data: RNFetchBlob.wrap(cleanFilePath)
      }
    ]
  );
  return responsePromise;
};

const uploadProgress = (
  params: IUploadInput,
  setUploadProgress?: (currentProgress: number, totalProgress: number) => void
) => {
  const responsePromise = readyForUpload(params);
  setTimeout(() => {
    if ((responsePromise as any).uploadProgress) {
      (responsePromise as any).uploadProgress(
        { interval: PROGRESS_INTERVAL },
        (written: string, total: string) => {
          setUploadProgress?.(Number(written), Number(total));
        }
      );
    }
  }, 100);
  return responsePromise;
};

const upload = async (
  params: IUploadInput,
  setUploadProgress?: (currentProgress: number, totalProgress: number) => void
) => {
  const uploadResponse = await uploadProgress(params, setUploadProgress);
  const response: {
    status: number;
    body: string;
  } = await uploadResponse.json();
  if (
    ![NORMAL_STATUS_, NORMAL_STATUS].some(status => status === response?.status)
  ) {
    throw new OSMGError({
      status: response?.status ?? 0,
      body: response?.body ?? `${response?.status ?? ""}`
    });
  }
  return response;
};

const getFileSize = async (uri: string) => {
  const stat = await RNFetchBlob.fs.stat(uri);
  return stat.size;
};

export { uploadProgress, upload, getFileSize };
export default upload;
