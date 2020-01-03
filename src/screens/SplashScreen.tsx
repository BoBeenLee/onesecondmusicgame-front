import LottieView from "lottie-react-native";
import { inject, observer } from "mobx-react";
import React from "react";
import styled from "styled-components/native";

import XEIcon from "src/components/icon/XEIcon";
import { Bold12, Bold20 } from "src/components/text/Typographies";
import images from "src/images";
import { IStore } from "src/stores/Store";
import { iosStatusBarHeight } from "src/utils/device";
import { initialize as initializeRequestAPI } from "src/configs/requestAPI";
import { initialize as initializeRemoteConfig } from "src/configs/remoteConfig";
import { ICodePushStore } from "src/stores/CodePushStore";
import { IAuthStore } from "src/stores/AuthStore";
import { IPushNotificationStore } from "src/stores/PushNotificationStore";
import MainScreen from "src/screens/MainScreen";
import SignInScreen from "src/screens/SignInScreen";

interface IInject {
  authStore: IAuthStore;
  codePushStore: ICodePushStore;
  pushNotificationStore: IPushNotificationStore;
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

const Name = styled(Bold20)`
  color: #000;
`;

@inject(
  ({ store }: { store: IStore }): IInject => ({
    authStore: store.authStore,
    codePushStore: store.codePushStore,
    pushNotificationStore: store.pushNotificationStore
  })
)
@observer
class SplashScreen extends React.Component<IProps> {
  public animation: Animated.Value | null = null;

  public async componentDidMount() {
    await this.initializeApp();
    this.navigateTo();
  }

  public render() {
    return (
      <Container>
        <Name>123</Name>
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

  private initializeApp = async () => {
    const { authStore, codePushStore, pushNotificationStore } = this.props;

    await initializeRemoteConfig();
    codePushStore.initialize();
    pushNotificationStore.initialize();
    authStore.initialize();
    initializeRequestAPI();
  };

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
