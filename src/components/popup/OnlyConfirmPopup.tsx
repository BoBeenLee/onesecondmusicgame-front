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
  onCancel?: () => void;
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

function OnlyConfirmPopup(props: IProps) {
  const { style, ContentComponent, confirmText, onConfirm, onCancel } = props;

  return (
    <OSMGPopup
      style={style}
      ContentComponent={
        <>
          <Content>{ContentComponent}</Content>
          <Bottom>
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

export default OnlyConfirmPopup;
