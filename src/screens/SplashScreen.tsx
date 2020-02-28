import { inject, observer } from "mobx-react";
import React from "react";
import styled from "styled-components/native";

import XEIcon from "src/components/icon/XEIcon";
import { Bold12, Bold20 } from "src/components/text/Typographies";
import images from "src/images";
import { IStore } from "src/stores/Store";
import { IAuthStore } from "src/stores/AuthStore";
import { ICodePushStore } from "src/stores/CodePushStore";
import { MainScreenStatic } from "src/screens/MainScreen";
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
  background-color: ${colors.darkIndigo};
`;

const Logo = styled.Image`
  width: 177px;
  height: 64px;
  resize-mode: contain;
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
  public async componentDidMount() {
    const { store } = this.props;
    await store.initializeApp();
    this.navigateTo();
  }

  public render() {
    return (
      <Container>
        <Logo source={images.splash} />
      </Container>
    );
  }

  private navigateTo = () => {
    const { isGuest } = this.props.authStore;
    if (isGuest) {
      SignInScreen.open();
      return;
    }
    MainScreenStatic.open();
  };
}

export default SplashScreen;
