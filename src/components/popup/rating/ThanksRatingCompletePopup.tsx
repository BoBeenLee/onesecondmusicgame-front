import _ from "lodash";
import React from "react";
import styled from "styled-components/native";
import { ViewProps } from "react-native";

import {
  Bold13,
  Bold15,
  Bold20,
  Bold24,
  Regular15,
  Regular17,
  Regular24
} from "src/components/text/Typographies";
import OnlyConfirmPopup from "src/components/popup/OnlyConfirmPopup";
import colors from "src/styles/colors";
import CountBadge from "src/components/badge/CountBadge";
import XEIcon from "src/components/icon/XEIcon";
import images from "src/images";

interface IProps {
  style?: ViewProps["style"];
  onConfirm: () => void;
}

const OuterContainer = styled(OnlyConfirmPopup)`
  width: 307px;
`;

const Content = styled.View`
  justify-content: center;
  align-items: center;
  margin-bottom: 7px;
`;

const Title = styled(Bold24)`
  text-align: center;
  color: ${colors.dark};
  margin-top: 48px;
`;

const Description = styled(Regular15)`
  text-align: center;
  color: ${colors.slateGrey};
  margin-top: 14px;
  margin-bottom: 14px;
`;

const HeartIconView = styled.View`
  width: 30px;
  height: 30px;
`;

const HeartImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: contain;
`;

const HeartCount = styled(CountBadge)`
  width: 16px;
  height: 16px;
`;

const HeartCountText = styled(Bold13)`
  color: ${colors.white};
`;

const ThanksRatingCompletePopup = (props: IProps) => {
  const { style, onConfirm } = props;
  return (
    <OuterContainer
      style={style}
      ContentComponent={
        <Content>
          <Title>별점 감사합니다</Title>
          <Description>{`회원님의 별점에 꼭 보답하는
알쏭달쏭이 되겠습니다`}</Description>
          <HeartIconView>
            <HeartImage source={images.inviteHeart} />
            <HeartCount TextComponent={HeartCountText} count={5} />
          </HeartIconView>
          <Description>{`감사한 마음을 담아
하트 풀충전 아이템 선물드립니다.
계속해서 신나는 플레이하세요~!`}</Description>
        </Content>
      }
      confirmText={"확인"}
      onConfirm={onConfirm}
    />
  );
};

export default ThanksRatingCompletePopup;
