import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";
import { GoogleSigninButton } from "@react-native-community/google-signin";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold14 } from "src/components/text/Typographies";
import { IStore } from "src/stores/Store";
import { IAuthStore } from "src/stores/AuthStore";
import { IToastStore } from "src/stores/ToastStore";
import { SCREEN_IDS } from "src/screens/constant";
import { setRoot } from "src/utils/navigator";
import MainScreen from "src/screens/MainScreen";
import colors from "src/styles/colors";

interface IInject {
  authStore: IAuthStore;
  toastStore: IToastStore;
}

interface IProps extends IInject {
  componentId: string;
}

const Container = styled(ContainerWithStatusBar)`
  flex: 1;
  flex-direction: column;
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Logo = styled(Bold14)`
  color: ${colors.white};
`;

const Bottom = styled.View`
  justify-content: center;
  align-items: center;
  padding-bottom: 100px;
`;

const SignInButton = styled.TouchableOpacity``;

const ButtonText = styled(Bold12)`
  color: ${colors.white};
`;

@inject(
  ({ store }: { store: IStore }): IInject => ({
    authStore: store.authStore,
    toastStore: store.toastStore
  })
)
@observer
class SignInScreen extends Component<IProps> {
  public static open() {
    setRoot({
      nextComponentId: SCREEN_IDS.SignInScreen
    });
  }

  public render() {
    return (
      <Container>
        <Content>
          <Logo>Logo</Logo>
        </Content>
        <Bottom>
          <SignInButton onPress={this.kakaoSignIn}>
            <ButtonText>카카오 로그인</ButtonText>
          </SignInButton>
          <GoogleSigninButton
            style={{ width: 192, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this.googleSignIn}
          />
          <SignInButton onPress={this.facebookSignIn}>
            <ButtonText>페이스북 로그인</ButtonText>
          </SignInButton>
        </Bottom>
      </Container>
    );
  }

  private facebookSignIn = async () => {
    const { facebookSignIn } = this.props.authStore;
    const { showToast } = this.props.toastStore;

    try {
      await facebookSignIn();
      MainScreen.open();
    } catch (error) {
      showToast(error.message);
    }
  };

  private googleSignIn = async () => {
    const { googleSignIn } = this.props.authStore;
    const { showToast } = this.props.toastStore;

    try {
      await googleSignIn();
      MainScreen.open();
    } catch (error) {
      showToast(error.message);
    }
  };

  private kakaoSignIn = async () => {
    const { kakaoSignIn } = this.props.authStore;
    const { showToast } = this.props.toastStore;

    try {
      await kakaoSignIn();
      MainScreen.open();
    } catch (error) {
      showToast(error.message);
    }
  };
}

export default SignInScreen;
