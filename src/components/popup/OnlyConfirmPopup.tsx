import React from "react";
import styled from "styled-components/native";

import colors from "src/styles/colors";
import { ViewProps } from "react-native";
import { Bold12, Bold17 } from "src/components/text/Typographies";
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
  border-radius: 17px;
  background-color: ${colors.paleGrey};
  padding-horizontal: 16px;
  padding-vertical: 11px;
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
  margin-bottom: 20px;
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

const CloseButton = styled(XEIconButton)`
  position: absolute;
  top: 11px;
  right: 16px;
`;

function OnlyConfirmPopup(props: IProps) {
  const { style, ContentComponent, confirmText, onConfirm, onCancel } = props;

  return (
    <OutterContainer>
      <Container style={style}>
        <Content>{ContentComponent}</Content>
        <Bottom>
          <ConfirmButton onPress={onConfirm}>
            <ConfirmButtonText>{confirmText}</ConfirmButtonText>
          </ConfirmButton>
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
