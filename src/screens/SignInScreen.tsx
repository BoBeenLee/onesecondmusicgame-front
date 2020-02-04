import _ from "lodash";
import React, { Component } from "react";
import { Platform } from "react-native";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";
import { GoogleSigninButton } from "@react-native-community/google-signin";
import { AppleButton } from "@invertase/react-native-apple-authentication";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold14 } from "src/components/text/Typographies";
import { IStore } from "src/stores/Store";
import { IAuthStore } from "src/stores/AuthStore";
import { IToastStore } from "src/stores/ToastStore";
import { SCREEN_IDS } from "src/screens/constant";
import { setRoot } from "src/utils/navigator";
import MainScreen from "src/screens/MainScreen";
import colors from "src/styles/colors";
import { ErrorCode } from "src/configs/error";
import UserProfileScreen from "src/screens/user/UserProfileScreen";
import { IForm } from "src/components/form/UserProfileForm";

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

  constructor(props: IProps) {
    super(props);

    const enhancedLoginFlow = _.flow([
      this.enhancedErrorIfSignInError,
      this.enhancedIfSignIn
    ]);
    this.facebookSignIn = enhancedLoginFlow(this.facebookSignIn);
    this.googleSignIn = enhancedLoginFlow(this.googleSignIn);
    this.kakaoSignIn = enhancedLoginFlow(this.kakaoSignIn);
    this.appleSignIn = enhancedLoginFlow(this.appleSignIn);
  }

  public render() {
    return (
      <Container>
        <Content>
          <Logo>Logo</Logo>
        </Content>
        <Bottom>
          {Platform.select({
            android: null,
            ios: (
              <AppleButton
                cornerRadius={5}
                buttonStyle={AppleButton.Style.WHITE}
                buttonType={AppleButton.Type.CONTINUE}
                onPress={this.appleSignIn}
              />
            )
          })}
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

  private enhancedIfSignIn = (func: any) => async (...args: any[]) => {
    try {
      await func(...args);
    } catch (error) {
      const { showToast } = this.props.toastStore;
      showToast(error.message);
    }
  };

  private enhancedErrorIfSignInError = (func: any) => async (
    ...args: any[]
  ) => {
    try {
      return await func(...args);
    } catch (error) {
      const { componentId } = this.props;

      if (
        [ErrorCode.NOT_FOUND, ErrorCode.FORBIDDEN_ERROR].some(
          status => status === error.status
        )
      ) {
        UserProfileScreen.open({
          componentId,
          onConfirm: this.fallbackSignUpAndSignIn
        });
        return;
      }
      throw error;
    }
  };

  private fallbackSignUpAndSignIn = async (data: IForm) => {
    const { signUp } = this.props.authStore;
    const { showToast } = this.props.toastStore;

    try {
      await signUp(data);
      MainScreen.open();
    } catch (error) {
      showToast(error.message);
    }
  };

  private facebookSignIn = async () => {
    const { facebookSignIn } = this.props.authStore;
    await facebookSignIn();
    MainScreen.open();
  };

  private googleSignIn = async () => {
    const { googleSignIn } = this.props.authStore;
    await googleSignIn();
    MainScreen.open();
  };

  private kakaoSignIn = async () => {
    const { kakaoSignIn } = this.props.authStore;
    await kakaoSignIn();
    MainScreen.open();
  };

  private appleSignIn = async () => {
    const { appleSignIn } = this.props.authStore;
    await appleSignIn();
    MainScreen.open();
  };
}

export default SignInScreen;
