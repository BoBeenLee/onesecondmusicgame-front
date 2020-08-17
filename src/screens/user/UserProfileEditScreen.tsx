import _ from "lodash";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ImagePicker from "react-native-image-picker";

import { SCREEN_IDS } from "src/screens/constant";
import { push, pop } from "src/utils/navigator";
import { PopupProps } from "src/hocs/withPopup";
import { IAuthStore } from "src/stores/AuthStore";
import { IToastStore } from "src/stores/ToastStore";
import { IStore } from "src/stores/Store";
import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import colors from "src/styles/colors";
import UserProfileForm, { IForm } from "src/components/form/UserProfileForm";
import BackTopBar from "src/components/topbar/BackTopBar";
import MockButton from "src/components/button/MockButton";
import ProfileImage from "src/components/image/ProfileImage";
import { myInfoChangeUsingPOST } from "src/apis/user";
import { LoadingProps } from "src/hocs/withLoading";

interface IInject {
  authStore: IAuthStore;
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
  onConfirm?: (data: IForm) => void;
}

interface IProps extends IInject, IParams, PopupProps, LoadingProps {
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

const InnerContainer = styled(KeyboardAwareScrollView).attrs({})``;

const Content = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding-top: 70px;
  padding-bottom: 31px;
  padding-horizontal: 41px;
`;

const ProfileImageButton = styled.TouchableOpacity``;

@inject(
  ({ store }: { store: IStore }): IInject => ({
    authStore: store.authStore,
    toastStore: store.toastStore
  })
)
@observer
class UserProfileEditScreen extends Component<IProps, IStates> {
  public static open(params: IParams) {
    const { componentId, ...restParams } = params;
    return push({
      componentId: componentId,
      nextComponentId: SCREEN_IDS.UserProfileEditScreen,
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

    this.onConfirm =
      props.loadingProps.wrapperLoading?.(this.onConfirm) ?? this.onConfirm;
  }

  public render() {
    const { profileImage } = this.state;
    const nickname = this.props.authStore.user?.nickname;
    return (
      <Container>
        <BackTopBar title="프로필 편집" onBackPress={this.back} />
        <InnerContainer
          scrollEnabled={true}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
        >
          <Content>
            <ProfileImageButton onPress={this.imagePicker}>
              <ProfileImage size={81} uri={profileImage} editable={true} />
            </ProfileImageButton>
            <UserProfileForm nickname={nickname} onConfirm={this.onConfirm} />
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
          await this.props.authStore?.user?.changeProfileImage(response.uri);
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
    if (!onConfirm) {
      await this.updateUser(data);
      this.back();
      return;
    }
    onConfirm(data);
  };

  private updateUser = async (data: IForm) => {
    const { showToast } = this.props.toastStore;
    const { nickname } = data;
    const { updateUser } = this.props.authStore;
    await updateUser({ nickname });
    showToast("닉네임 변경완료");
  };

  private back = () => {
    const { componentId } = this.props;
    pop(componentId);
  };
}

export default UserProfileEditScreen;
