import LottieView from "lottie-react-native";
import React from "react";
import styled from "styled-components/native";

import images from "src/images";

const Container = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: transparent;
  z-index: 999;
`;

const LoadingLottieView = styled(LottieView)`
  width: 120px;
  height: 120px;
`;

const Loading = () => {
  const loadingAnimation = images.animation;

  return (
    <Container>
      <LoadingLottieView
        autoPlay={false}
        ref={playAnimation}
        loop={true}
        speed={1}
        source={loadingAnimation}
      />
    </Container>
  );
};

const playAnimation = (animation: any) => {
  if (animation) {
    animation.play();
  }
};

export default Loading;
