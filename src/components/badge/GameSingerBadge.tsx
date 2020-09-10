import React from "react";
import { TouchableOpacityProps } from "react-native";
import styled, { css } from "styled-components/native";

import { Bold16 } from "src/components/text/Typographies";
import colors from "src/styles/colors";
import images from "src/images";

type SingerBadgeType = "selected" | "unselected" | "random";

type Props = {
  style?: TouchableOpacityProps["style"];
  type: SingerBadgeType;
  name: string;
  onClose?: () => void;
};

const containerByType: Record<SingerBadgeType, any> = {
  selected: css`
    background-color: ${colors.paleLavender};
  `,
  unselected: css`
    background-color: ${colors.duskyBlue};
  `,
  random: css`
    border: 2px solid ${colors.blueberry};
  `
};

const nameByType: Record<SingerBadgeType, any> = {
  selected: css`
    color: ${colors.darkTwo};
  `,
  unselected: css`
    color: ${colors.white};
  `,
  random: css`
    color: ${colors.pastelBlue};
  `
};

const Container = styled.TouchableOpacity<{ type: SingerBadgeType }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 33px;
  padding-left: 19px;
  padding-right: 19px;
  border-radius: 17px;
  ${({ type }) => containerByType[type]}
`;

const Name = styled(Bold16)<{ type: SingerBadgeType }>`
  color: ${colors.darkTwo};
  ${({ type }) => nameByType[type]}
`;

const CloseButton = styled.Image`
  width: 13px;
  height: 13px;
  margin-left: 9px;
`;

const GameSingerBadge = (props: Props) => {
  const { style, type, name, onClose } = props;
  return (
    <Container style={style} type={type} onPress={onClose}>
      <Name type={type} numberOfLines={1}>
        {name}
      </Name>
      {type === "selected" ? (
        <CloseButton source={images.icGameSingerClose} />
      ) : null}
    </Container>
  );
};

export default GameSingerBadge;
