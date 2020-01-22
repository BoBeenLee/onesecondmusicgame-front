import { useState, useEffect, useCallback } from "react";

export interface IAnimationFuncParams {
  isShow: boolean;
  toValue: number;
  callback?: () => any;
}

interface IAnimationConfig {
  initialIsShow?: boolean;
  activeToValue: number;
  inActiveToValue: number;
  animationFunc: (params: IAnimationFuncParams) => void;
  onToggle?: (isShow: boolean) => void;
}

function useShowAnimation(config: IAnimationConfig) {
  const { activeToValue, inActiveToValue, animationFunc } = config;
  const [isShow, setIsShowItems] = useState(Boolean(config.initialIsShow));

  useEffect(() => {
    if (isShow) {
      animationFunc({
        isShow,
        toValue: activeToValue
      });
    }
  }, [activeToValue, animationFunc, isShow]);

  const onToggle = useCallback(
    (isShow: boolean) => {
      config.onToggle?.(isShow);
      if (isShow) {
        setIsShowItems(isShow);
        return;
      }
      animationFunc({
        isShow,
        toValue: inActiveToValue,
        callback: () => {
          setIsShowItems(isShow);
        }
      });
    },
    [animationFunc, config.onToggle, inActiveToValue]
  );

  return {
    isShow,
    onToggle
  };
}

export default useShowAnimation;
