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
import { myInfoChangeUsingPOST } from "src/apis/user";

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

const InnerContainer = styled(KeyboardAwareScrollView).attrs({
  contentContainerStyle: {
    flex: 1,
    flexDirection: "column",
    height: "100%"
  }
})``;

const Content = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding-top: 70px;
  padding-bottom: 31px;
  padding-horizontal: 41px;
`;

const ProfileImage = styled.Image`
  width: 50px;
  height: 50px;
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

  constructor(props: IProps) {
    super(props);

    this.state = {
      nicknameInput: "",
      profileImage: ""
    };
  }

  public render() {
    const { profileImage } = this.state;
    return (
      <Container>
        <BackTopBar title="닉네임 설정" onBackPress={this.back} />
        <InnerContainer
          scrollEnabled={false}
          enableOnAndroid={true}
          enableAutomaticScroll={false}
        >
          <Content>
            <ProfileImage source={{ uri: profileImage }} />
            <MockButton name="이미지 불러오기" onPress={this.imagePicker} />
            <UserProfileForm onConfirm={this.onConfirm} />
          </Content>
        </InnerContainer>
      </Container>
    );
  }

  private imagePicker = () => {
    const { showToast } = this.props.toastStore;
    const options = {
      title: "프로필 이미지 불러오기",
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };
    ImagePicker.showImagePicker(options, async response => {
      if (response.didCancel) {
        showToast("User cancelled image picker");
      } else if (response.error) {
        showToast("ImagePicker Error: " + response.error);
      } else if (response.customButton) {
        showToast("User tapped custom button: " + response.customButton);
      } else {
        try {
          await myInfoChangeUsingPOST(response.uri);
          this.setState({
            profileImage: response.uri
          });
          showToast("이미지 변경 완료");
        } catch (error) {
          showToast(error.message);
        }
      }
    });
  };

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
