import _ from "lodash";
import { NativeScrollPoint, NativeScrollSize } from "react-native";

const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
  recognitionBottomDistance = 20
}: {
  contentOffset: NativeScrollPoint;
  contentSize: NativeScrollSize;
  layoutMeasurement: NativeScrollSize;
  recognitionBottomDistance?: number;
}) => {
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - recognitionBottomDistance
  );
};

const getHitSlop = (iconSize: number) => {
  const divisionValue = 2;

  const extendSize = _.floor(iconSize / divisionValue);

  return {
    bottom: extendSize,
    left: extendSize,
    right: extendSize,
    top: extendSize
  };
};

export { isCloseToBottom, getHitSlop };
