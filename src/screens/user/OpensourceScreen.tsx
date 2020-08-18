import _ from "lodash";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { SCREEN_IDS } from "src/screens/constant";
import { push, pop } from "src/utils/navigator";
import { PopupProps } from "src/hocs/withPopup";
import { IAuthStore } from "src/stores/AuthStore";
import { IToastStore } from "src/stores/ToastStore";
import { IStore } from "src/stores/Store";
import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import colors from "src/styles/colors";
import BackTopBar from "src/components/topbar/BackTopBar";
import MockButton from "src/components/button/MockButton";
import { myInfoChangeUsingPOST } from "src/apis/user";
import { LoadingProps } from "src/hocs/withLoading";

interface IInject {
  authStore: IAuthStore;
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
}

interface IProps extends IInject, IParams, PopupProps, LoadingProps {
  componentId: string;
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

const Text = styled.Text``;

@inject(
  ({ store }: { store: IStore }): IInject => ({
    authStore: store.authStore,
    toastStore: store.toastStore
  })
)
@observer
class OpensourceScreen extends Component<IProps> {
  public static open(params: IParams) {
    const { componentId, ...restParams } = params;
    return push({
      componentId: componentId,
      nextComponentId: SCREEN_IDS.OpensourceScreen,
      params: restParams
    });
  }

  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <Container>
        <BackTopBar title="오픈소스 라이선스" onBackPress={this.back} />
        <InnerContainer
          scrollEnabled={true}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
        >
          <Content>
            <Text>test</Text>
          </Content>
        </InnerContainer>
      </Container>
    );
  }

  private back = () => {
    const { componentId } = this.props;
    pop(componentId);
  };
}

export default OpensourceScreen;
