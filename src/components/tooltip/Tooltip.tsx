import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";

import images from "src/images";
import colors from "src/styles/colors";
import { Bold12 } from "src/components/text/Typographies";
import zIndex from "src/styles/zIndex";

interface IProps {
  style?: ViewProps["style"];
  message: string;
  onPress: () => void;
}

const Container = styled.TouchableWithoutFeedback``;

const Inner = styled.View`
  align-items: center;
  padding-top: 10px;
`;

const TooltipBackground = styled.Image`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 291px;
  height: 51px;
`;

const Message = styled(Bold12)`
  color: ${colors.darkIndigo};
  z-index: ${zIndex.middle};
`;

const Tooltip = (props: IProps) => {
  const { style, message, onPress } = props;
  return (
    <Container style={style} onPress={onPress}>
      <Inner>
        <Message>{message}</Message>
        <TooltipBackground source={images.tooltip} />
      </Inner>
    </Container>
  );
};

export default Tooltip;
