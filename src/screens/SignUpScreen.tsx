import React, { Component } from 'react';
import styled from "styled-components/native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold14 } from "src/components/text/Typographies";

const Container = styled(ContainerWithStatusBar)`
    flex: 1;
    flex-direction: column;
`;

const Content = styled.View`
    flex: 1;
`;

const Logo = styled(Bold14)``;

const Bottom = styled.View``;

const SignInButton = styled.TouchableOpacity``;

const ButtonText = styled(Bold12)``;


class SignUpScreen extends Component {
    public render() {
        return (
            <Container>
                <Content>
                    <Logo>SignUp</Logo>
                </Content>
            </Container>
        );
    }
}

export default SignUpScreen;