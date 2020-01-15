import _ from "lodash";
import { Image, ImageEditor } from "react-native";

import { appendQueryParams } from "./uri";

const MAX_IMAGE_WIDTH = 720;
const IMAGE_MAX_DIMENSION = 1440;
const IMAGE_MAX_RATIOS = {
  tall: 4 / 3,
  wide: 16 / 9
};

const getDimensionByRatio = (ratio: string) => {
  const [widthRatio, heightRatio] = _.split(ratio, ":");
  return {
    heightRatio,
    widthRatio
  };
};

const getRatioHeight = (ratio: string, width: number) => {
  const [widthRatio, heightRatio] = _.split(ratio, ":");
  return (width * Number(heightRatio)) / Number(widthRatio);
};

const getSize = (uri: string): Promise<{ width: number; height: number }> => {
  const response = new Promise<{ width: number; height: number }>(
    (resolve, reject) => {
      const getSizeSuccessCallback = (width: number, height: number) => {
        resolve({ width, height });
      };
      const getSizeFailCallback = (error: any) => {
        reject(error);
      };
      Image.getSize(uri, getSizeSuccessCallback, getSizeFailCallback);
    }
  );
  return response;
};

const getResizedUri = (uri: string, width: number = MAX_IMAGE_WIDTH) => {
  return appendQueryParams(uri, {
    d: `${width}`
  });
};

const cropImage = (
  uri: string,
  width: number,
  height: number,
  offsetX: number,
  offsetY: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    ImageEditor.cropImage(
      uri,
      {
        offset: { x: offsetX, y: offsetY },
        size: { width, height }
      },
      croppedImageURI => {
        resolve(croppedImageURI);
      },
      error => {
        reject(error);
      }
    );
  });
};

const getCropDimensions = (width: number, height: number) => {
  const maximumWidth = height * IMAGE_MAX_RATIOS.wide;
  const maximumHeight = width * IMAGE_MAX_RATIOS.tall;

  const isWide = width > maximumWidth;
  const isTall = height > maximumHeight;

  const cropWidth = isWide ? maximumWidth : width;
  const cropHeight = isTall ? maximumHeight : height;

  return {
    cropHeight,
    cropWidth
  };
};

const getResizeDimension = (width: number, height: number) => {
  const widthReduceRatio = Math.min(IMAGE_MAX_DIMENSION / width, 1);
  const heightReduceRatio = Math.min(IMAGE_MAX_DIMENSION / height, 1);
  const reduceRatio = Math.min(widthReduceRatio, heightReduceRatio);

  return {
    resizeHeight: height * reduceRatio,
    resizeWidth: width * reduceRatio
  };
};

export {
  IMAGE_MAX_RATIOS,
  IMAGE_MAX_DIMENSION,
  getDimensionByRatio,
  getRatioHeight,
  getCropDimensions,
  getResizeDimension,
  getResizedUri,
  getSize
};
