import _ from "lodash";
import React, { useState } from "react";
import styled from "styled-components/native";

import ConfirmCancelPopup from "src/components/popup/ConfirmCancelPopup";
import colors from "src/styles/colors";
import { Regular15, Regular20, Bold20 } from "src/components/text/Typographies";
import OSMGTextInput from "src/components/input/OSMGTextInput";

type Props = {
  onConfirm: (feedback: string) => void;
  onCancel: () => void;
};

const OutterContainer = styled(ConfirmCancelPopup)`
  width: 307px;
  min-height: 226px;
  align-items: center;
`;

const Content = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 29px;
`;

const Title = styled(Bold20)`
  color: ${colors.dark};
  margin-top: 35px;
  margin-bottom: 33px;
`;

const FeedbackInputView = styled.View`
  min-width: 100%;
  height: 87px;
  padding: 10px;
  background-color: ${colors.paleLavender};
`;

const FeedbackInput = styled(OSMGTextInput).attrs({})`
  flex: 1;
  font-size: 15px;
  color: ${colors.brownishGrey};
`;

const FeedbackRatingPopup = (props: Props) => {
  const { onConfirm, onCancel } = props;
  const [feedback, setFeedback] = useState("");

  const onChangeText = (text: string) => {
    setFeedback(text);
  };

  return (
    <OutterContainer
      ContentComponent={
        <Content>
          <Title>피드백 주시면 반영하겠습니다</Title>
          <FeedbackInputView>
            <FeedbackInput
              multiline={true}
              onChangeText={onChangeText}
              placeholder="마음 다치지 않을게요... 마구마구 써주세요."
              value={feedback}
            />
          </FeedbackInputView>
        </Content>
      }
      confirmText="제출"
      onConfirm={_.partial(onConfirm, feedback)}
      cancelText="무시하기"
      onCancel={onCancel}
    />
  );
};

export default FeedbackRatingPopup;
