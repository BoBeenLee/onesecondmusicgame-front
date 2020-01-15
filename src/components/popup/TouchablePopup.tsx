import React, { useEffect } from "react";
import styled from "styled-components/native";
import withBackHandler, { IBackHandlerProps } from "src/hocs/withBackHandler";

interface IProps extends IBackHandlerProps {
  onBackgroundPress: () => boolean;
  PopupComponent: React.ReactNode;
}

const PopupContainer = styled.View`
  position: absolute;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 99;
`;

const PopupTouchableOverlay = styled.TouchableOpacity.attrs({
  activeOpacity: 1
})`
  position: absolute;
  width: 100%;
  height: 100%;
`;

function TouchablePopup(props: IProps) {
  const { onBackgroundPress } = props;
  useEffect(() => {
    props.backHandlerProps.addBackButtonListener(onBackgroundPress);
  }, [onBackgroundPress, props.backHandlerProps]);

  return (
    <PopupContainer>
      <PopupTouchableOverlay onPress={props.onBackgroundPress} />
      {props.PopupComponent}
    </PopupContainer>
  );
}

export default withBackHandler(TouchablePopup);
