import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";
import {
    GoogleSigninButton
} from "@react-native-community/google-signin";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold14 } from "src/components/text/Typographies";
import { IStore } from "src/stores/Store";
import { IAuthStore } from "src/stores/AuthStore";
import { SCREEN_IDS } from "src/screens/constant";
import { setStackRoot } from "src/utils/navigator";
import SignUpScreen from "src/screens/SignUpScreen";
import { fadeTransition } from "src/screens/styles/animations";

interface IInject {
    authStore: IAuthStore;
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
        authStore: store.authStore
    })
)
@observer
class SignInScreen extends Component<IProps> {
    public static open(componentId: string) {
        setStackRoot({
            animtaions: fadeTransition,
            componentId,
            nextComponentId: SCREEN_IDS.SignInScreen
        });
    }

    public render() {
        const { kakaoSignIn, googleSignIn } = this.props.authStore;
        return (
            <Container>
                <Content>
                    <Logo>Logo</Logo>
                </Content>
                <Bottom>
                    <SignInButton onPress={kakaoSignIn}>
                        <ButtonText>카카오 로그인</ButtonText>
                    </SignInButton>
                    <GoogleSigninButton
                        style={{ width: 192, height: 48 }}
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.Dark}
                        onPress={googleSignIn}
                    />
                    <SignInButton onPress={SignUpScreen.open}>
                        <ButtonText>회원 가입</ButtonText>
                    </SignInButton>
                </Bottom>
            </Container>
        );
    }
}

export default SignInScreen;
