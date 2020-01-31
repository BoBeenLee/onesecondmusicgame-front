import LottieView from "lottie-react-native";
import { inject, observer } from "mobx-react";
import React from "react";
import styled from "styled-components/native";

import XEIcon from "src/components/icon/XEIcon";
import { Bold12, Bold20 } from "src/components/text/Typographies";
import images from "src/images";
import { IStore } from "src/stores/Store";
import { iosStatusBarHeight } from "src/utils/device";
import { IAuthStore } from "src/stores/AuthStore";
import { ICodePushStore } from "src/stores/CodePushStore";
import MainScreen from "src/screens/MainScreen";
import SignInScreen from "src/screens/SignInScreen";
import colors from "src/styles/colors";
import GamePlayHighlights from "src/stores/GamePlayHighlights";
import GameResultScreen from "./game/GameResultScreen";

interface IInject {
  store: IStore;
  authStore: IAuthStore;
  codePushStore: ICodePushStore;
}

interface IProps extends IInject {
  componentId: string;
}

const Container = styled.View`
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-top: ${iosStatusBarHeight(false)}px;
`;

const Title = styled(Bold20)`
  color: ${colors.black};
  margin-top: 35px;
`;

@inject(
  ({ store }: { store: IStore }): IInject => ({
    store,
    authStore: store.authStore,
    codePushStore: store.codePushStore
  })
)
@observer
class SplashScreen extends React.Component<IProps> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public animation: any = null;

  public async componentDidMount() {
    const { store } = this.props;
    await store.initializeApp();
    this.navigateTo();
  }

  public render() {
    return (
      <Container>
        <Title>123</Title>
        <LottieView
          style={{
            backgroundColor: "#eee",
            opacity: 0.5
          }}
          ref={animation => {
            this.animation = animation;
          }}
          source={images.animation}
        />
        <XEIcon name="close" color="#800" size={50} />
      </Container>
    );
  }

  private navigateTo = () => {
    const { isGuest } = this.props.authStore;
    if (isGuest) {
      SignInScreen.open();
      return;
    }
    MainScreen.open();
  };
}

export default SplashScreen;
