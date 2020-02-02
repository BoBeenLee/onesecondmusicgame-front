import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";

import { SCREEN_IDS } from "src/screens/constant";
import { push, pop, getCurrentComponentId } from "src/utils/navigator";
import { IPopupProps } from "src/hocs/withPopup";
import { IAuthStore } from "src/stores/AuthStore";
import { IToastStore } from "src/stores/ToastStore";
import { IStore } from "src/stores/Store";
import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import colors from "src/styles/colors";
import UserProfileForm, { IForm } from "src/components/form/UserProfileForm";

interface IInject {
  authStore: IAuthStore;
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
  onConfirm: (data: IForm) => Promise<void>;
}

interface IProps extends IInject, IParams, IPopupProps {
  componentId: string;
}

interface IStates {
  nicknameInput: string;
}

const Container = styled(ContainerWithStatusBar)`
  flex: 1;
  flex-direction: column;
`;

const Content = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding-top: 70px;
  padding-bottom: 31px;
  padding-horizontal: 41px;
`;

@inject(
  ({ store }: { store: IStore }): IInject => ({
    authStore: store.authStore,
    toastStore: store.toastStore
  })
)
@observer
class UserProfileScreen extends Component<IProps, IStates> {
  public static open(params: IParams) {
    const { componentId, ...restParams } = params;
    return push({
      componentId: componentId,
      nextComponentId: SCREEN_IDS.UserProfileScreen,
      params: restParams
    });
  }

  public render() {
    const { onConfirm } = this.props;
    return (
      <Container>
        <Content>
          <UserProfileForm onConfirm={onConfirm} />
        </Content>
      </Container>
    );
  }
}

export default UserProfileScreen;
