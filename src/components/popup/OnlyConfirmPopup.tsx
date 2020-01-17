import React from "react";
import styled from "styled-components/native";

import colors from "src/styles/colors";
import { ViewProps } from "react-native";
import { Bold12 } from "src/components/text/Typographies";
import XEIconButton from "src/components/button/XEIconButton";

interface IProps {
  style?: ViewProps["style"];
  ContentComponent: React.ReactNode;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const OutterContainer = styled.View`
  width: 100%;
  padding-horizontal: 50px;
`;

const Container = styled.View`
  width: 100%;
  flex-direction: column;
  border-radius: 6px;
  background-color: #eee;
  padding: 10px;
`;

const Content = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Bottom = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Button = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  background-color: ${colors.gray500};
  padding-vertical: 15px;
  padding-horizontal: 10px;
  margin-bottom: 33px;
`;

const ButtonText = styled(Bold12)``;

const ConfirmButtonText = styled(ButtonText)``;

const CloseButton = styled(XEIconButton)`
  position: absolute;
  top: 10px;
  right: 10px;
`;

function OnlyConfirmPopup(props: IProps) {
  const { style, ContentComponent, confirmText, onConfirm, onCancel } = props;

  return (
    <OutterContainer>
      <Container style={style}>
        <Content>{ContentComponent}</Content>
        <Bottom>
          <Button onPress={onConfirm}>
            <ConfirmButtonText>{confirmText}</ConfirmButtonText>
          </Button>
        </Bottom>
        <CloseButton
          iconName="close"
          iconSize={24}
          iconColor={colors.black}
          onPress={onCancel}
        />
      </Container>
    </OutterContainer>
  );
}

export default OnlyConfirmPopup;
