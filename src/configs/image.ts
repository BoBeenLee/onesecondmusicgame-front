import _ from "lodash";
import ImageResizer from "react-native-image-resizer";

import { getSize, getRatioHeight } from "src/utils/image";

const IMAGE_RESIZING_OPTIONS = {
  format: "PNG" as "PNG",
  quality: 80
};

export const resizeImageByURI = async (
  inputURI: string,
  resizeWidth: number
) => {
  const { width, height } = await getSize(inputURI);
  const resizeHeight = getRatioHeight(`${width}:${height}`, resizeWidth);
  const { uri, size } = await ImageResizer.createResizedImage(
    inputURI,
    resizeWidth,
    resizeHeight,
    IMAGE_RESIZING_OPTIONS.format,
    IMAGE_RESIZING_OPTIONS.quality
  );
  return {
    height: resizeHeight,
    uri,
    width: resizeWidth,
    size
  };
};
