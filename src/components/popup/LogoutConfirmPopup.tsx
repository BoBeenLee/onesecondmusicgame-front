import React from "react";
import styled from "styled-components/native";

import OnlyConfirmPopup from "src/components/popup/OnlyConfirmPopup";
import colors from "src/styles/colors";
import { Regular15, Bold20 } from "src/components/text/Typographies";

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

const OutterContainer = styled(OnlyConfirmPopup)`
  width: 307px;
  min-height: 226px;
  align-items: center;
`;

const Container = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled(Bold20)`
  color: ${colors.black};
  margin-top: 30px;
  margin-bottom: 18px;
`;

const Description = styled(Regular15)`
  text-align: center;
  color: ${colors.black};
  line-height: 19px;
  margin-bottom: 18px;
`;

const LogoutConfirmPopup = (props: Props) => {
  const { onConfirm, onCancel } = props;
  return (
    <OutterContainer
      ContentComponent={
        <Container>
          <Title>로그아웃 하시겠어요??</Title>
          <Description>{`언제든지 해당 계정으로 다시 로그인하여 
게임을 이어서 하실 수 있습니다.`}</Description>
        </Container>
      }
      confirmText="로그아웃"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

export default LogoutConfirmPopup;
