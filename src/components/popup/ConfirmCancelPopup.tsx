import React from "react";
import styled from "styled-components/native";

import colors from "src/styles/colors";
import { ViewProps } from "react-native";
import { Bold12, Bold17 } from "src/components/text/Typographies";
import OSMGPopup from "src/components/popup/OSMGPopup";

interface IProps {
  style?: ViewProps["style"];
  ContentComponent: React.ReactNode;
  confirmText: string;
  onConfirm: () => void;
  cancelText: string;
  onCancel: () => void;
}

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

const ConfirmButton = styled.TouchableOpacity`
  flex: 1;
  height: 50px;
  justify-content: center;
  align-items: center;
  border-radius: 14px;
  border: solid 3px ${colors.lightMagenta};
  background-color: ${colors.pinkyPurple};
`;

const ConfirmButtonText = styled(Bold17)`
  text-align: center;
  color: ${colors.white};
`;

const CancelButton = styled(ConfirmButton)`
  border: solid 3px ${colors.lightBlueGrey};
  background-color: ${colors.paleLavender};
  margin-right: 11px;
`;

const CancelButtonText = styled(ConfirmButtonText)`
  text-align: center;
  color: ${colors.purply};
`;

function ConfirmCancelPopup(props: IProps) {
  const {
    style,
    ContentComponent,
    confirmText,
    onConfirm,
    cancelText,
    onCancel
  } = props;

  return (
    <OSMGPopup
      style={style}
      ContentComponent={
        <>
          <Content>{ContentComponent}</Content>
          <Bottom>
            <CancelButton onPress={onCancel}>
              <CancelButtonText>{cancelText}</CancelButtonText>
            </CancelButton>
            <ConfirmButton onPress={onConfirm}>
              <ConfirmButtonText>{confirmText}</ConfirmButtonText>
            </ConfirmButton>
          </Bottom>
        </>
      }
      onCancel={onCancel}
    />
  );
}

export default ConfirmCancelPopup;
