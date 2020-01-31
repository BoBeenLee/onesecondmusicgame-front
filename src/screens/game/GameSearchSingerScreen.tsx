import _ from "lodash";
import React, { Component, ComponentClass } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";
import { FlatListProps, FlatList, ListRenderItem } from "react-native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import {
  Bold12,
  Regular14,
  Bold18,
  Bold14,
  Regular12
} from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { push, pop } from "src/utils/navigator";
import colors from "src/styles/colors";
import SearchTextInput from "src/components/input/SearchTextInput";
import { ISinger } from "src/apis/singer";
import SearchSingerCard from "src/components/card/SearchSingerCard";
import { filterNull } from "src/utils/common";
import SingersSubmitBackDrop from "src/components/backdrop/SingersSubmitBackDrop";
import { IStore } from "src/stores/Store";
import { ISingerStore } from "src/stores/SingerStore";
import { IToastStore } from "src/stores/ToastStore";
import withScrollDirection, {
  IScrollDirectionProps
} from "src/hocs/withScrollDirection";
import { ScrollDirection } from "src/utils/scrollView";
import RegisterSongScreen from "src/screens/song/RegisterSongScreen";

interface IInject {
  singerStore: ISingerStore;
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
  onResult: (selectedSingers: ISinger[]) => void;
}

interface IProps extends IParams, IInject, IScrollDirectionProps {}

interface IStates {
  selectedSingers: { [key in string]: ISinger | null };
  showMinimumSubmit: boolean;
}

const Container = styled(ContainerWithStatusBar)`
  flex: 1;
  flex-direction: column;
`;

const Header = styled.View`
  justify-content: center;
  align-items: center;
`;

const Title = styled(Bold18)`
  color: ${colors.lightGrey};
  margin-top: 35px;
`;

const Description = styled(Regular14)`
  color: ${colors.lightGrey};
  margin-top: 16px;
`;

const SearchView = styled.View`
  margin-top: 50px;
  margin-horizontal: 44px;
`;

const Content = styled.View`
  flex: 1;
  padding-horizontal: 21px;
  margin-top: 37px;
`;

const ResultText = styled(Bold12)`
  color: ${colors.lightGrey};
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
  margin-bottom: 31px;
`;

const RegisterSongButton = styled.TouchableOpacity`
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

const SELECTED_SINGERS_MAX_LENGTH = 3;

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

  constructor(props: IProps) {
    super(props);

    this.state = { selectedSingers: {}, showMinimumSubmit: false };

    this.onResultScroll = _.debounce(this.onResultScroll, 210);
  }

  public render() {
    const { singerViews, refresh, isRefresh } = this.singers;
    const { onScroll } = this.props.scrollDirectionProps;
    const { showMinimumSubmit } = this.state;

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
                <ResultEmptyTitle>검색결과가 없습니다.</ResultEmptyTitle>
                <ResultEmptyDescription>
                  {`음원 등록에서 찾으시는 곡을 검색해
  를 눌러주시면 곡을 등록하실 수 있습니다.`}
                </ResultEmptyDescription>
                <RegisterSongButton onPress={this.navigateToRegisterSong}>
                  <RegisterSongButtonText>
                    음원등록 하러가기
                  </RegisterSongButtonText>
                </RegisterSongButton>
              </ResultEmpty>
            }
            scrollEventThrottle={16}
            onScroll={onScroll(this.onResultScroll)}
          />
        </Content>
        <SingersSubmitBackDrop
          showMinimumSubmit={showMinimumSubmit}
          selectedSingers={this.selectedSingers}
          onSubmit={this.submit}
          onSelectedItem={this.onSelectedItem}
        />
      </Container>
    );
  }

  private get singers() {
    return this.props.singerStore.singers;
  }

  private onResultScroll = (scrollDirection: ScrollDirection) => {
    const { showMinimumSubmit } = this.state;

    if (scrollDirection === ScrollDirection.IDLE) {
      return;
    }
    if (
      showMinimumSubmit === false &&
      scrollDirection === ScrollDirection.DOWNWARD
    ) {
      this.setState({
        showMinimumSubmit: true
      });
      return;
    }
    if (
      showMinimumSubmit === true &&
      scrollDirection === ScrollDirection.UPWARD
    ) {
      this.setState({
        showMinimumSubmit: false
      });
      return;
    }
  };

  private get selectedSingers() {
    const { selectedSingers } = this.state;
    return filterNull(_.values(selectedSingers));
  }

  private hasSelectedSingersByName = (name: string) => {
    return Boolean(this.state.selectedSingers[name]);
  };

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
    if (
      !this.hasSelectedSingersByName(item.name) &&
      this.selectedSingers.length >= SELECTED_SINGERS_MAX_LENGTH
    ) {
      return;
    }
    this.setState(prevState => {
      return {
        selectedSingers: {
          ...prevState.selectedSingers,
          [item.name]: !Boolean(prevState.selectedSingers[item.name])
            ? item
            : null
        },
        showMinimumSubmit: false
      };
    });
  };

  private submit = () => {
    const { onResult } = this.props;
    const { selectedSingers } = this.state;
    onResult(this.selectedSingers);
  };

  private navigateToRegisterSong = () => {
    const { componentId } = this.props;
    RegisterSongScreen.open({
      componentId
    });
  };

  private back = () => {
    const { componentId } = this.props;
    pop(componentId);
  };
}

export default withScrollDirection({ sensitivity: 10 })(GameSearchSingerScreen);
