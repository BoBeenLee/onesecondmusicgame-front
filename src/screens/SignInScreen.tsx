import _ from "lodash";
import React, { Component } from "react";
import { Platform } from "react-native";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";
import { GoogleSigninButton } from "@react-native-community/google-signin";
import { AppleButton } from "@invertase/react-native-apple-authentication";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import {
  Bold12,
  Bold14,
  Bold24,
  Regular24
} from "src/components/text/Typographies";
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
import images from "src/images";
import IconButton from "src/components/button/IconButton";

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

const MirrorBallView = styled.View`
  position: absolute;
  top: 0px;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MirrorBall = styled.Image`
  width: 174px;
  height: 87px;
`;

const MirrorBackground = styled.Image`
  position: absolute;
  top: 77px;
  width: 100%;
  height: 100%;
`;

const Content = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

const Description = styled(Regular24)`
  color: ${colors.white};
  text-align: center;
  margin-bottom: 43px;
`;

const HightlightDescription = styled(Bold24)`
  color: ${colors.white};
`;

const ButtonGroup = styled.View`
  flex-direction: column;
  justify-content: center;
`;

const SignInButton = styled(IconButton)`
  height: 49px;
  margin-bottom: 9px;
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
        <MirrorBackground source={images.mirrorballLight} />
        <MirrorBallView>
          <MirrorBall source={images.mirrorball} />
        </MirrorBallView>
        <Content>
          <Description>
            <HightlightDescription>간편한 SNS 로그인</HightlightDescription>
            으로{"\n"} 알쏭달쏭과 함께 음악을 맞춰봐요~
          </Description>
          <ButtonGroup>
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
            <SignInButton source={images.btnKakao} onPress={this.kakaoSignIn} />
            <SignInButton
              source={images.btnFacebook}
              onPress={this.facebookSignIn}
            />
            <SignInButton
              source={images.btnGoogle}
              onPress={this.googleSignIn}
            />
          </ButtonGroup>
        </Content>
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
    const isSignIn = await facebookSignIn();
    if (!isSignIn) {
      return;
    }
    MainScreen.open();
  };

  private googleSignIn = async () => {
    const { googleSignIn } = this.props.authStore;
    const isSignIn = await googleSignIn();
    if (!isSignIn) {
      return;
    }
    MainScreen.open();
  };

  private kakaoSignIn = async () => {
    const { kakaoSignIn } = this.props.authStore;
    const isSignIn = await kakaoSignIn();
    if (!isSignIn) {
      return;
    }
    MainScreen.open();
  };

  private appleSignIn = async () => {
    const { appleSignIn } = this.props.authStore;
    const isSignIn = await appleSignIn();
    if (!isSignIn) {
      return;
    }
    MainScreen.open();
  };
}

export default SignInScreen;
