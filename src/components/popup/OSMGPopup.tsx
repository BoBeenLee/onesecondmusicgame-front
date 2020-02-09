import React from "react";
import styled from "styled-components/native";

import colors from "src/styles/colors";
import { ViewProps } from "react-native";
import XEIconButton from "src/components/button/XEIconButton";

interface IProps {
  style?: ViewProps["style"];
  ContentComponent: React.ReactNode;
  onCancel?: () => void;
}

const OutterContainer = styled.View`
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.View`
  flex-direction: column;
  border-radius: 17px;
  background-color: ${colors.paleGrey};
  padding-horizontal: 16px;
  padding-top: 11px;
  padding-bottom: 32px;
`;

const CloseButton = styled(XEIconButton)`
  position: absolute;
  top: 11px;
  right: 16px;
`;

function OSMGPopup(props: IProps) {
  const { style, ContentComponent, onCancel } = props;

  return (
    <OutterContainer>
      <Container style={style}>
        {ContentComponent}
        {onCancel ? (
          <CloseButton
            iconName="close"
            iconSize={24}
            iconColor={colors.black}
            onPress={onCancel}
          />
        ) : null}
      </Container>
    </OutterContainer>
  );
}

export default OSMGPopup;
