import { useState } from "react";
import { Animated } from "react-native";

function useScale() {
  const [scale] = useState(new Animated.Value(1));

  const onPressIn = () => {
    scale.stopAnimation();
    Animated.timing(scale, {
      duration: 150,
      toValue: 0.92,
      useNativeDriver: true
    }).start();
  };

  const onPressOut = () => {
    scale.stopAnimation();
    Animated.timing(scale, {
      duration: 150,
      toValue: 1,
      useNativeDriver: true
    }).start();
  };

  return {
    onPressIn,
    onPressOut,
    scale
  };
}

export default useScale;
