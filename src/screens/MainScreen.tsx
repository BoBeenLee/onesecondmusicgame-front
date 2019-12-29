import React, { Component } from "react";
import styled from "styled-components/native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold14 } from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { setStackRoot } from "src/utils/navigator";
import colors from "src/styles/colors";
import { fadeTransition } from "src/screens/styles/animations";

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

class MainScreen extends Component {
    public static open(componentId: string) {
        setStackRoot({
            animtaions: fadeTransition,
            componentId,
            nextComponentId: SCREEN_IDS.MainScreen
        });
    }

    public render() {
        return (
            <Container>
                <Content>
                    <Logo>Main</Logo>
                </Content>
            </Container>
        );
    }
}

export default MainScreen;
