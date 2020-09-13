import React from "react";
import styled from "styled-components/native";

import colors from "src/styles/colors";
import { ViewProps } from "react-native";
import { Bold17, Bold20 } from "src/components/text/Typographies";

interface IProps {
  style?: ViewProps["style"];
  message: React.ReactNode;
  confirmText: string;
  onConfirm: () => void;
  cancelText: string;
  onCancel: () => void;
}

const Container = styled.View`
  flex-direction: column;
  border-radius: 17px;
  background-color: ${colors.paleGrey};
  padding-horizontal: 24px;
  padding-bottom: 32px;
`;

const Message = styled(Bold20)`
  text-align: center;
  color: ${colors.black};
  padding-top: 47px;
  padding-bottom: 52px;
`;

const Bottom = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

const CancelButton = styled.TouchableOpacity`
  width: 126px;
  justify-content: center;
  align-items: center;
  height: 50px;
  border-radius: 14px;
  border: solid 3px ${colors.lightBlueGrey};
  background-color: ${colors.paleLavender};
  margin-right: 8px;
`;

const CancelButtonText = styled(Bold17)`
  color: ${colors.purply};
`;

const ConfirmButton = styled.TouchableOpacity`
  width: 126px;
  justify-content: center;
  align-items: center;
  height: 50px;
  border-radius: 14px;
  border: solid 3px ${colors.lightMagentaThree};
  background-color: ${colors.pinkyPurple};
`;

const ConfirmButtonText = styled(Bold17)`
  color: ${colors.white};
`;

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
      <Message>{message}</Message>
      <Bottom>
        <CancelButton onPress={onCancel}>
          <CancelButtonText>{cancelText}</CancelButtonText>
        </CancelButton>
        <ConfirmButton onPress={onConfirm}>
          <ConfirmButtonText>{confirmText}</ConfirmButtonText>
        </ConfirmButton>
      </Bottom>
    </Container>
  );
}

export default ConfirmPopup;
