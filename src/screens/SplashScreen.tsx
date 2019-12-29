import LottieView from "lottie-react-native";
import { inject, observer } from "mobx-react";
import React from "react";
import styled from "styled-components/native";

import XEIcon from "src/components/icon/XEIcon";
import { Bold12, Bold20 } from "src/components/text/Typographies";
import images from "src/images";
import { IStore } from "src/stores/Store";
import { iosStatusBarHeight } from "src/utils/device";
import { setStackRoot } from "src/utils/navigator";
import { SCREEN_IDS } from "src/screens/constant";
import { initialize as initializeRequestAPI } from "src/configs/requestAPI";
import { fadeTransition } from "src/screens/styles/animations";
import { initialize as initializeRemoteConfig } from "src/configs/remoteConfig";
import { ICodePushStore } from "src/stores/CodePushStore";
import { IAuthStore } from "src/stores/AuthStore";
import { IPushNotificationStore } from "src/stores/PushNotificationStore";

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
  public animation: any = null;

  public async componentDidMount() {
    await this.initializeApp();
    this.navigateTo();
  }

  public render() {
    return (
      <Container>
        <Name>
          123
        </Name>
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
    const {
      codePushStore,
      pushNotificationStore
    } = this.props;

    await initializeRemoteConfig();
    codePushStore.initialize();
    pushNotificationStore.initialize();
    initializeRequestAPI();
  }

  private navigateTo = () => {
    const { componentId } = this.props;
    // If Not SignIn
    setStackRoot({
      animtaions: fadeTransition,
      componentId,
      nextComponentId: SCREEN_IDS.SignInScreen,
    });
  }
}

export default SplashScreen;
