import _ from "lodash";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";

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
import { Regular16, Bold14, Bold16 } from "src/components/text/Typographies";
import UserItemCard from "src/components/card/UserItemCard";
import UserProfileEditScreen from "src/screens/user/UserProfileEditScreen";
import SignInScreen from "src/screens/SignInScreen";
import LogoutConfirmPopup from "src/components/popup/LogoutConfirmPopup";

interface IInject {
  authStore: IAuthStore;
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
}

interface IProps extends IInject, IParams, PopupProps {
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

const ProfileEditButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  min-height: 33px;
  border-radius: 19px;
  border-width: 2px;
  border-color: ${colors.lightGrey};
  padding-horizontal: 19px;
  margin-top: 20px;
`;

const ProfileEditButtonText = styled(Bold14)`
  color: ${colors.lightGrey};
`;

const Content = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding-top: 70px;
  padding-bottom: 31px;
  padding-horizontal: 41px;
`;

const Bottom = styled.View`
  padding-left: 16px;
  padding-right: 16px;
`;

const ButtonGroup = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 9px;
  padding-right: 9px;
  padding-top: 23px;
  padding-bottom: 23px;
`;

const LogoutButton = styled.TouchableOpacity``;

const LogoutButtonText = styled(Bold16)`
  color: ${colors.lightMagenta};
`;

const SocialType = styled(Regular16)`
  color: ${colors.lightGrey};
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

    const profileImageUrl = props.authStore.user?.profileImageUrl ?? "";
    this.state = {
      nicknameInput: "",
      profileImage: !_.isEmpty(profileImageUrl) ? profileImageUrl : ""
    };
  }

  public render() {
    const { profileImage } = this.state;
    const { socialType } = this.props.authStore;
    return (
      <Container>
        <BackTopBar title="계정 설정" onBackPress={this.back} />
        <Content>
          <ProfileImage size={81} uri={profileImage} editable={false} />
          <ProfileEditButton onPress={this.navigateToProfileEdit}>
            <ProfileEditButtonText>프로필 편집</ProfileEditButtonText>
          </ProfileEditButton>
        </Content>
        <Bottom>
          <UserItemCard
            title="오픈소스 라이선스"
            description="오픈소스 소프트웨어에 대한 라이선스 세부정보"
            onPress={this.navigateToOpensource}
          />
          <ButtonGroup>
            <LogoutButton onPress={this.showLogoutPopup}>
              <LogoutButtonText>로그아웃</LogoutButtonText>
            </LogoutButton>
            <SocialType>{socialType}</SocialType>
          </ButtonGroup>
        </Bottom>
      </Container>
    );
  }

  private navigateToOpensource = () => {
    // TODO
  };

  private navigateToProfileEdit = () => {
    const { componentId } = this.props;
    UserProfileEditScreen.open({
      componentId
    });
  };

  private back = () => {
    const { componentId } = this.props;
    pop(componentId);
  };

  private showLogoutPopup = () => {
    const { showPopup } = this.props.popupProps;
    showPopup(
      <LogoutConfirmPopup onConfirm={this.logout} onCancel={this.closePopup} />
    );
  };

  private closePopup = () => {
    const { showPopup } = this.props.popupProps;
    showPopup(null);
  };

  private logout = () => {
    const { signOut } = this.props.authStore;
    SignInScreen.open();
    signOut();
  };
}

export default UserProfileScreen;
