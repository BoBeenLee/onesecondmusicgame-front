import _ from "lodash";
import ImageResizer from "react-native-image-resizer";

import { getSize, getResizeDimension } from "src/utils/images";

const IMAGE_RESIZING_OPTIONS = {
  format: "JPEG" as "JPEG",
  quality: 80
};

export const resizeImageByURI = async (inputURI: string) => {
  const { width, height } = await getSize(inputURI);
  const { resizeWidth, resizeHeight } = getResizeDimension(width, height);
  const { uri } = await ImageResizer.createResizedImage(
    inputURI,
    resizeWidth,
    resizeHeight,
    IMAGE_RESIZING_OPTIONS.format,
    IMAGE_RESIZING_OPTIONS.quality
  );

  return {
    height: resizeHeight,
    uri,
    width: resizeWidth
  };
};
