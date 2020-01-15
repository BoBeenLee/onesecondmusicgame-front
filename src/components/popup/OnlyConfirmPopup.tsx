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

const Container = styled.View`
  flex-direction: column;
  height: 180px;
  border-radius: 6px;
  background-color: #eee;
  padding: 10px;
`;

const Content = styled.View`
  flex: 1;
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
  width: 100px;
  height: 40px;
  background-color: ${colors.gray500};
  margin-horizontal: 10px;
`;

const ButtonText = styled(Bold12)``;

const ConfirmButtonText = styled(ButtonText)``;

const CloseButton = styled(XEIconButton)`
  position: absolute;
  top: 0px;
  right: 0px;
`;

function OnlyConfirmPopup(props: IProps) {
  const { style, ContentComponent, confirmText, onConfirm, onCancel } = props;

  return (
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
        iconColor={colors.gray300}
        onPress={onCancel}
      />
    </Container>
  );
}

export default OnlyConfirmPopup;
