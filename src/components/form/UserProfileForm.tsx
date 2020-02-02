import React, { useEffect, useCallback } from "react";
import { ViewProps } from "react-native";
import { useForm, OnSubmit } from "react-hook-form";
import styled from "styled-components/native";

import colors from "src/styles/colors";
import OSMGTextInput from "src/components/input/OSMGTextInput";
import {
  Bold12,
  Bold17,
  Bold18,
  Regular12
} from "src/components/text/Typographies";

interface IProps {
  style?: ViewProps["style"];
  onConfirm: (data: IForm) => Promise<void>;
}

export interface IForm {
  nickname: string;
}

const Container = styled.View`
  flex: 1;
  width: 100%;
  flex-direction: column;
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Title = styled(Bold18)`
  color: ${colors.lightGrey};
  margin-bottom: 67px;
`;

const NicknameInput = styled.View`
  width: 100%;
  height: 40px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 11px;
  border-bottom-width: 4px;
  border-bottom-color: ${colors.blueberry};
`;

const NicknameTextInput = styled(OSMGTextInput).attrs({
  focusStyle: { color: colors.paleGrey }
})`
  font-size: 16px;
  text-align: center;
  color: ${colors.brownishGrey};
`;

const ValidText = styled(Regular12)`
  color: ${colors.robinEggBlue};
`;

const ConfirmButton = styled.TouchableOpacity`
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

const UserProfileForm = (props: IProps) => {
  const { style, onConfirm } = props;
  const { register, setValue, setError, handleSubmit, errors } = useForm<
    IForm
  >();

  useEffect(() => {
    register({ name: "nickname" }, { required: true });
  }, [register]);

  const onSubmit: OnSubmit<IForm> = async (data: IForm) => {
    try {
      await onConfirm(data);
    } catch (error) {
      setError("nickname", error.message);
    }
  };

  return (
    <Container style={style}>
      <Content>
        <Title>게임에 사용할 닉네임을 설정해주세요</Title>
        <NicknameInput>
          <NicknameTextInput
            onChangeText={text => setValue("nickname", text, true)}
            placeholder="닉네임 입력 (최소 3글자 이상)"
          />
        </NicknameInput>
        {Boolean(errors.nickname?.message) ? (
          <ValidText>{errors.nickname?.message}</ValidText>
        ) : null}
      </Content>
      <ConfirmButton onPress={handleSubmit(onSubmit)}>
        <ConfirmButtonText>확인</ConfirmButtonText>
      </ConfirmButton>
    </Container>
  );
};

export default UserProfileForm;
