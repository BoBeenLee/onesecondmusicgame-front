import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";
import { GoogleSigninButton } from "@react-native-community/google-signin";
import { LoginButton, AccessToken, LoginResult } from "react-native-fbsdk";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold14 } from "src/components/text/Typographies";
import { IStore } from "src/stores/Store";
import { IAuthStore } from "src/stores/AuthStore";
import { IToastStore } from "src/stores/ToastStore";
import { SCREEN_IDS } from "src/screens/constant";
import { setRoot } from "src/utils/navigator";
import SignUpScreen from "src/screens/SignUpScreen";
import MainScreen from "src/screens/MainScreen";
import { tracks } from "src/apis/soundcloud/tracks";

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

const Logo = styled(Bold14)``;

const Bottom = styled.View`
  justify-content: center;
  align-items: center;
  padding-bottom: 100px;
`;

const SignInButton = styled.TouchableOpacity``;

const ButtonText = styled(Bold12)``;

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

  public async componentDidMount() {
    await tracks({
      q: "hello world"
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
          <LoginButton onLoginFinished={this.facebookSignIn} />
          <SignInButton onPress={SignUpScreen.open}>
            <ButtonText>회원 가입</ButtonText>
          </SignInButton>
        </Bottom>
      </Container>
    );
  }

  private facebookSignIn = (error: object, result: LoginResult) => {
    if (error) {
      console.log("login has error: " + result.error);
    } else if (result.isCancelled) {
      console.log("login is cancelled.");
    } else {
      AccessToken.getCurrentAccessToken().then(data => {
        console.log(data?.accessToken?.toString());
      });
    }
  };

  private googleSignIn = () => {
    const { googleSignIn } = this.props.authStore;
    const { showToast } = this.props.toastStore;

    try {
      googleSignIn();
      MainScreen.open();
    } catch (error) {
      showToast(error.message);
    }
  };

  private kakaoSignIn = () => {
    const { kakaoSignIn } = this.props.authStore;
    const { showToast } = this.props.toastStore;

    try {
      kakaoSignIn();
      MainScreen.open();
    } catch (error) {
      showToast(error.message);
    }
  };
}

export default SignInScreen;
