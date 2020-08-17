import React from "react";
import styled from "styled-components/native";

import { Regular12, Bold14 } from "src/components/text/Typographies";
import images from "src/images";
import colors from "src/styles/colors";

type Props = {
  title: string;
  description: string;
  onPress: () => void;
};

const Container = styled.TouchableOpacity`
  flex-direction: column;
  justify-content: center;
  min-height: 64px;
  border-top-width: 1px;
  border-top-color: rgba(243, 243, 240, 0.5);
  border-bottom-width: 1px;
  border-bottom-color: rgba(243, 243, 240, 0.5);
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding-left: 13px;
  padding-right: 13px;
  margin-bottom: 6px;
`;

const Title = styled(Bold14)`
  color: ${colors.lightGrey};
`;

const ArrowRightIcon = styled.Image`
  width: 7px;
  height: 15px;
  margin-left: 8px;
`;

const Content = styled.View`
  padding-left: 13px;
  padding-right: 13px;
`;

const Description = styled(Regular12)`
  color: ${colors.lightGrey};
`;

const UserItemCard = (props: Props) => {
  const { title, description, onPress } = props;
  return (
    <Container onPress={onPress}>
      <Header>
        <Title>{title}</Title>
        <ArrowRightIcon source={images.icWhiteArrowRight} />
      </Header>
      <Content>
        <Description>{description}</Description>
      </Content>
    </Container>
  );
};

export default UserItemCard;
