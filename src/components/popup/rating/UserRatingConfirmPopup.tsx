import React from "react";
import styled from "styled-components/native";

import ConfirmCancelPopup from "src/components/popup/ConfirmCancelPopup";
import colors from "src/styles/colors";
import { Regular15, Bold15, Bold20 } from "src/components/text/Typographies";

type Props = {
  nickname: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const OutterContainer = styled(ConfirmCancelPopup)`
  width: 307px;
  align-items: center;
`;

const Content = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 31px;
`;

const Title = styled(Bold20)`
  color: ${colors.dark};
  margin-top: 35px;
  margin-bottom: 14px;
`;

const Description = styled(Regular15)`
  color: ${colors.black};
  text-align: center;
`;

const UserRatingConfirmPopup = (props: Props) => {
  const { nickname, onConfirm, onCancel } = props;
  return (
    <OutterContainer
      ContentComponent={
        <Content>
          <Title>{nickname}님</Title>
          <Description>
            {`알쏭달쏭 재미있게 플레이하고 계신가요?
(당신의 손가락은 ‘네’로 향한다...)`}
          </Description>
        </Content>
      }
      confirmText="네!!"
      onConfirm={onConfirm}
      cancelText="별로에요..."
      onCancel={onCancel}
    />
  );
};

export default UserRatingConfirmPopup;
