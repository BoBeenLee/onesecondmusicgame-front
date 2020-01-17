import _ from "lodash";
import React, { Component, ComponentClass } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";
import { FlatListProps, FlatList, ListRenderItem } from "react-native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold14, Bold20 } from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { push, pop } from "src/utils/navigator";
import colors from "src/styles/colors";
import SearchTextInput from "src/components/input/SearchTextInput";
import { ISinger } from "src/apis/singer";
import Singers, { ISingers } from "src/stores/Singers";
import SearchSingerCard from "src/components/card/SearchSingerCard";
import { filterNull } from "src/utils/common";
import SingersSubmitBackDrop from "src/components/backdrop/SingersSubmitBackDrop";
import { IStore } from "src/stores/Store";
import { ISingerStore } from "src/stores/SingerStore";
import { IToastStore } from "src/stores/ToastStore";

interface IInject {
  singerStore: ISingerStore;
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
  onResult: (selectedSingers: ISinger[]) => void;
}

interface IProps extends IParams, IInject {}

interface IStates {
  selectedSingers: { [key in string]: ISinger | null };
}

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
  color: ${colors.black};
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
  justify-content: center;
  align-items: center;
`;

const ResultEmptyText = styled(Bold12)``;

@inject(
  ({ store }: { store: IStore }): IInject => ({
    singerStore: store.singerStore,
    toastStore: store.toastStore
  })
)
@observer
class GameSearchSingerScreen extends Component<IProps, IStates> {
  public static open(params: IParams) {
    return push({
      componentId: params.componentId,
      nextComponentId: SCREEN_IDS.GameSearchSingerScreen,
      params: {
        onResult: params.onResult
      }
    });
  }

  public singers: ISingers;

  constructor(props: IProps) {
    super(props);
    this.singers = Singers.create({
      singers: props.singerStore.singers
    });

    this.state = { selectedSingers: {} };
  }

  public async componentDidMount() {
    await this.singers.initialize({ q: "" });
  }

  public render() {
    const { singerViews, refresh, isRefresh } = this.singers;

    return (
      <Container>
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
                <ResultEmptyText>검색결과가 없습니다.</ResultEmptyText>
              </ResultEmpty>
            }
          />
        </Content>
        <SingersSubmitBackDrop
          selectedSingers={this.selectedSingers}
          onSubmit={this.submit}
          onSelectedItem={this.onSelectedItem}
        />
      </Container>
    );
  }

  private get selectedSingers() {
    const { selectedSingers } = this.state;
    return filterNull(_.values(selectedSingers));
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
    this.setState(prevState => {
      return {
        selectedSingers: {
          ...prevState.selectedSingers,
          [item.name]: !Boolean(prevState.selectedSingers[item.name])
            ? item
            : null
        }
      };
    });
  };

  private submit = () => {
    const { onResult } = this.props;
    const { selectedSingers } = this.state;
    onResult(this.selectedSingers);
  };

  private back = () => {
    const { componentId } = this.props;
    pop(componentId);
  };
}

export default GameSearchSingerScreen;
