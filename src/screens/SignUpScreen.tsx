import React, { Component } from 'react';
import styled from "styled-components/native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold14 } from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { showStackModal, dismissAllModals } from "src/utils/navigator";
import ModalTopBar from "src/components/topbar/ModalTopBar";
import colors from "src/styles/colors";

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

class SignUpScreen extends Component {
    public static open() {
        return showStackModal(SCREEN_IDS.SignUpScreen);
    }

    public render() {
        return (
            <Container>
                <ModalTopBar title="회원가입" onBackPress={this.back} />
                <Content>
                    <Logo>SignUp</Logo>
                </Content>
            </Container>
        );
    }

    private back = () => {
        dismissAllModals();
    }
}

export default SignUpScreen;