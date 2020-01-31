import _ from "lodash";
import React, { Component, ComponentClass } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";
import { FlatListProps, FlatList, ListRenderItem } from "react-native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import {
  Bold12,
  Bold14,
  Bold20,
  Regular12
} from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { push, pop } from "src/utils/navigator";
import colors from "src/styles/colors";
import SearchTextInput from "src/components/input/SearchTextInput";
import { ISinger } from "src/apis/singer";
import SearchSingerCard from "src/components/card/SearchSingerCard";
import { filterNull } from "src/utils/common";
import { IStore } from "src/stores/Store";
import { ISingerStore } from "src/stores/SingerStore";
import { IToastStore } from "src/stores/ToastStore";
import BackTopBar from "src/components/topbar/BackTopBar";

interface IInject {
  singerStore: ISingerStore;
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
  onResult: (selectedSinger: ISinger) => void;
}

interface IProps extends IParams, IInject {}

const Container = styled(ContainerWithStatusBar)`
  flex: 1;
  flex-direction: column;
`;

const Header = styled.View`
  justify-content: center;
  align-items: center;
`;

const Title = styled(Bold20)`
  margin-top: 35px;
`;

const Description = styled(Bold14)`
  margin-top: 16px;
`;

const SearchView = styled.View`
  margin-top: 50px;
  margin-horizontal: 44px;
`;

const Content = styled.View`
  flex: 1;
  padding-horizontal: 16px;
  margin-top: 37px;
`;

const ResultText = styled(Bold12)`
  color: ${colors.lightGreyTwo};
  margin-bottom: 20px;
`;

const Result = styled<ComponentClass<FlatListProps<ISinger>>>(FlatList)`
  flex: 1;
  width: 100%;
`;

const SearchSingerCardView = styled(SearchSingerCard)`
  margin: 8px;
`;

const ResultEmpty = styled.View`
  flex: 1;
  height: 400px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ResultEmptyTitle = styled(Bold12)`
  color: ${colors.lightGreyTwo};
  margin-bottom: 21px;
`;

const ResultEmptyDescription = styled(Regular12)`
  color: ${colors.lightGreyTwo};
`;

const RegisterSongButton = styled.View`
  justify-content: center;
  align-items: center;
  width: 153px;
  height: 37px;
  border-radius: 8px;
  border: solid 3px ${colors.lightMagenta};
  background-color: ${colors.pinkyPurple};
`;

const RegisterSongButtonText = styled(Bold14)`
  color: ${colors.lightGrey};
`;

@inject(
  ({ store }: { store: IStore }): IInject => ({
    singerStore: store.singerStore,
    toastStore: store.toastStore
  })
)
@observer
class SearchSingerScreen extends Component<IProps> {
  public static open(params: IParams) {
    const { componentId, ...restParams } = params;
    return push({
      componentId,
      nextComponentId: SCREEN_IDS.SearchSingerScreen,
      params: restParams
    });
  }

  public render() {
    const { singerViews, refresh, isRefresh } = this.singers;

    return (
      <Container>
        <BackTopBar title="검색" onBackPress={this.back} />
        <Header>
          <Title>어떤 가수의 음악이 자신있으세요?</Title>
          <Description>최대 3명의 가수를 선택하실 수 있습니다.</Description>
        </Header>
        <SearchView>
          <SearchTextInput
            placeholder="가수명"
            onChangeInput={this.search}
            onSearch={this.search}
          />
        </SearchView>
        <Content>
          <ResultText>전체 {singerViews.length}</ResultText>
          <Result
            data={singerViews}
            numColumns={4}
            renderItem={this.renderSingerItem}
            keyExtractor={this.singerKeyExtreactor}
            refreshing={isRefresh}
            onRefresh={refresh}
            ListEmptyComponent={
              <ResultEmpty>
                <ResultEmptyTitle>검색결과가 없습니다.</ResultEmptyTitle>
                <ResultEmptyDescription>
                  {`음원 등록에서 찾으시는 곡을 검색해
  를 눌러주시면 곡을 등록하실 수 있습니다.`}
                </ResultEmptyDescription>
                <RegisterSongButton>
                  <RegisterSongButtonText>
                    음원등록 하러가기
                  </RegisterSongButtonText>
                </RegisterSongButton>
              </ResultEmpty>
            }
          />
        </Content>
      </Container>
    );
  }

  private get singers() {
    return this.props.singerStore.singers;
  }

  private singerKeyExtreactor = (item: ISinger, index: number) => {
    return String(item.name) + index;
  };

  private renderSingerItem: ListRenderItem<ISinger> = ({ item }) => {
    const { name } = item;
    return (
      <SearchSingerCardView
        image={"https://via.placeholder.com/150"}
        name={name}
        onPress={_.partial(this.onSelectedItem, item)}
      />
    );
  };

  private search = (text: string) => {
    this.singers.search({ q: text });
  };

  private onSelectedItem = (item: ISinger) => {
    const { onResult } = this.props;
    onResult(item);
  };

  private back = () => {
    const { componentId } = this.props;
    pop(componentId);
  };
}

export default SearchSingerScreen;
