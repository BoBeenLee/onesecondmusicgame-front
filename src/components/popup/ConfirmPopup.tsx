import React from "react";
import styled from "styled-components/native";

import colors from "src/styles/colors";
import { ViewProps } from "react-native";
import { Bold12 } from "src/components/text/Typographies";

interface IProps {
  style?: ViewProps["style"];
  message: string;
  confirmText: string;
  onConfirm: () => void;
  cancelText: string;
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

const Message = styled(Bold12)``;

const Bottom = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

const Button = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 40px;
  background-color: #ee0;
  margin-horizontal: 10px;
`;

const ButtonText = styled(Bold12)``;

const ConfirmButtonText = styled(ButtonText)``;

function ConfirmPopup(props: IProps) {
  const {
    style,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel
  } = props;

  return (
    <Container style={style}>
      <Content>
        <Message>{message}</Message>
      </Content>
      <Bottom>
        <Button onPress={onConfirm}>
          <ConfirmButtonText>{confirmText}</ConfirmButtonText>
        </Button>
        <Button onPress={onCancel}>
          <ButtonText>{cancelText}</ButtonText>
        </Button>
      </Bottom>
    </Container>
  );
}

export default ConfirmPopup;
