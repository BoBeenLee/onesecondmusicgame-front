import _ from "lodash";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ImagePicker from "react-native-image-picker";

import { SCREEN_IDS } from "src/screens/constant";
import { push, pop } from "src/utils/navigator";
import { IPopupProps } from "src/hocs/withPopup";
import { IAuthStore } from "src/stores/AuthStore";
import { IToastStore } from "src/stores/ToastStore";
import { IStore } from "src/stores/Store";
import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import colors from "src/styles/colors";
import UserProfileForm, { IForm } from "src/components/form/UserProfileForm";
import BackTopBar from "src/components/topbar/BackTopBar";
import MockButton from "src/components/button/MockButton";
import ProfileImage from "src/components/image/ProfileImage";

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
  profileImage: string;
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

const Bottom = styled.View``;

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

  constructor(props: IProps) {
    super(props);

    const profileImageUrl = props.authStore.user?.profileImageUrl ?? "";
    this.state = {
      nicknameInput: "",
      profileImage: !_.isEmpty(profileImageUrl) ? profileImageUrl : ""
    };
  }

  public render() {
    const { profileImage } = this.state;
    return (
      <Container>
        <BackTopBar title="계정 설정" onBackPress={this.back} />
        <Content>
          <ProfileImage size={81} uri={profileImage} editable={false} />
        </Content>
      </Container>
    );
  }

  private onConfirm = async (data: IForm) => {
    const { onConfirm } = this.props;
    await onConfirm?.(data);
    this.back();
  };

  private back = () => {
    const { componentId } = this.props;
    pop(componentId);
  };
}

export default UserProfileScreen;
