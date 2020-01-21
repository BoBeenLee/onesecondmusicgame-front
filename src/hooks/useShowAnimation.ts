import { useState, useEffect, useCallback } from "react";

export interface IAnimationFuncParams {
  isShow: boolean;
  toValue: number;
  callback?: () => any;
}

interface IAnimationConfig {
  activeToValue: number;
  inActiveToValue: number;
  animationFunc: (params: IAnimationFuncParams) => void;
  onToggle?: (isShow: boolean) => void;
}

function useShowAnimation(config: IAnimationConfig) {
  const { activeToValue, inActiveToValue, animationFunc } = config;
  const [isShow, setIsShowItems] = useState(false);

  useEffect(() => {
    if (isShow) {
      animationFunc({
        isShow,
        toValue: activeToValue
      });
    }
  }, [activeToValue, animationFunc, isShow]);

  const onToggle = useCallback(() => {
    const reverseIsShow = !isShow;
    config.onToggle?.(reverseIsShow);
    if (reverseIsShow) {
      setIsShowItems(reverseIsShow);
      return;
    }
    animationFunc({
      isShow: reverseIsShow,
      toValue: inActiveToValue,
      callback: () => {
        setIsShowItems(reverseIsShow);
      }
    });
  }, [animationFunc, config.onToggle, inActiveToValue, isShow]);

  return {
    isShow,
    onToggle
  };
}

export default useShowAnimation;
