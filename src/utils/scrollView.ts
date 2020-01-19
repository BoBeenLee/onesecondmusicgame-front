import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";

export enum ScrollDirection {
  IDLE = "IDLE",
  UPWARD = "UPWARD",
  DOWNWARD = "DOWNWARD"
}

export const getScrollDirection = (
  event: NativeSyntheticEvent<NativeScrollEvent>,
  {
    currentScrollDirection,
    scrollY,
    sensitivity
  }: {
    currentScrollDirection: ScrollDirection;
    scrollY: number;
    sensitivity: number;
  }
) => {
  const prevScrollY = scrollY;
  const currentScrollY = event.nativeEvent.contentOffset.y;
  const scrollDirection =
    currentScrollY > prevScrollY
      ? ScrollDirection.DOWNWARD
      : currentScrollY < prevScrollY
      ? ScrollDirection.UPWARD
      : ScrollDirection.IDLE;

  if (scrollDirection === ScrollDirection.IDLE) {
    return scrollDirection;
  }

  if (currentScrollDirection !== scrollDirection) {
    const diff = Math.abs(currentScrollY - prevScrollY);

    if (diff > sensitivity) {
      return scrollDirection;
    }
  }
  return null;
};
