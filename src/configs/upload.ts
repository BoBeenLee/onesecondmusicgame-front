import _ from "lodash";
import RNFetchBlob from "rn-fetch-blob";

type ImageExtensionType = "JPG" | "JPEG" | "PNG";
type VideoExtensionType = "MP4" | "M4V" | "MKV" | "AVI" | "MOV";
export type FileExtensionType = ImageExtensionType | VideoExtensionType;

export interface IUploadInput {
  fileExtension: FileExtensionType;
  filePath: string;
  uploadUrl: string;
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

const NO_CONTENT = 204;
const PROGRESS_INTERVAL = 250;

const METHOD_TYPE = "POST";

const getParams = () => ({
  "Content-Type": "application/octet-stream",
  method: METHOD_TYPE
});

const readyForUpload = (params: IUploadInput) => {
  const { filePath, uploadUrl } = params;
  const cleanFilePath = filePath.replace("file://", "");

  const responsePromise: Promise<IFetchBlobResponse> = RNFetchBlob.fetch(
    "PUT",
    uploadUrl,
    getParams(),
    RNFetchBlob.wrap(cleanFilePath)
  );

  return responsePromise;
};

const uploadProgress = (
  params: IUploadInput,
  setUploadProgress: (currentProgress: number, totalProgress: number) => void
) => {
  const responsePromise = readyForUpload(params);
  setTimeout(() => {
    if ((responsePromise as any).uploadProgress) {
      (responsePromise as any).uploadProgress(
        { interval: PROGRESS_INTERVAL },
        (written: string, total: string) => {
          setUploadProgress(Number(written), Number(total));
        }
      );
    }
  }, 100);
  return responsePromise;
};

const upload = async (
  params: IUploadInput,
  setUploadProgress: (currentProgress: number, totalProgress: number) => void,
  successCallback: (isSuccess: boolean) => void
) => {
  try {
    const response = await uploadProgress(params, setUploadProgress);
    const responseInfo: IFetchInfoResponse = response.info();
    if (responseInfo.status === NO_CONTENT) {
      successCallback(true);
      return true;
    }
    successCallback(false);
    return false;
  } catch (error) {
    throw error;
  }
};

const getFileSize = async (uri: string) => {
  const stat = await RNFetchBlob.fs.stat(uri);
  return stat.size;
};

export { uploadProgress, upload, getFileSize };
export default upload;
