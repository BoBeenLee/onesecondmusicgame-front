import _ from "lodash";
import React, { Component, ComponentClass } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";
import { FlatListProps, FlatList, ListRenderItem } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
import SearchThumnailSingerCard from "src/components/card/SearchThumnailSingerCard";
import { filterNull } from "src/utils/common";
import { IStore } from "src/stores/Store";
import { ISingerStore } from "src/stores/SingerStore";
import { IToastStore } from "src/stores/ToastStore";
import withScrollDirection, {
  IScrollDirectionProps
} from "src/hocs/withScrollDirection";
import SearchSingerScreen from "src/screens/song/SearchSingerScreen";
import BackTopBar from "src/components/topbar/BackTopBar";
import XEIcon from "src/components/icon/XEIcon";
import { logEvent } from "src/configs/analytics";
import withLoading, { LoadingProps } from "src/hocs/withLoading";
import GameSingerBadge from "src/components/badge/GameSingerBadge";

interface IInject {
  singerStore: ISingerStore;
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
  onResult: (selectedSingers: ISinger[]) => Promise<void>;
}

type GameMode = "RANDOM" | "HARD" | "NORMAL" | "EASY";

interface IProps
  extends IParams,
    IInject,
    IScrollDirectionProps,
    LoadingProps {}

interface IStates {
  selectedSingers: { [key in string]: ISinger | null };
  showMinimumSubmit: boolean;
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

const Result = styled<ComponentClass<FlatListProps<ISinger>>>(FlatList).attrs({
  contentContainerStyle: {
    paddingBottom: 235
  }
})`
  flex: 1;
  width: 100%;
`;

const SearchSingerCardView = styled(SearchThumnailSingerCard)`
  flex: 1;
  margin: 8px;
`;

const SearchSingerEmptyCard = styled.View`
  flex: 1;
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

const ResultEmptyRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const HeartIcon = styled(XEIcon)``;

const ResultEmptyDescription = styled(Regular12)`
  color: ${colors.lightGreyTwo};
`;

const RegisterSongButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width: 153px;
  height: 37px;
  border-radius: 8px;
  border: solid 3px ${colors.lightMagenta};
  background-color: ${colors.pinkyPurple};
  margin-top: 31px;
`;

const RegisterSongButtonText = styled(Bold14)`
  color: ${colors.lightGrey};
`;

const Bottom = styled.View`
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 100%;
  justify-content: center;
  align-items: center;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  background-color: ${colors.darkTwo};
  padding-horizontal: 41px;
  padding-bottom: 10px;
  padding-top: 20px;
`;

const GameSingerName = styled(Bold14)`
  color: ${colors.white};
`;

const HighlightGameSingerName = styled(Bold14)`
  color: ${colors.lightMagenta};
`;

const GameSingerBadgeGroup = styled.View`
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 7px;
  margin-bottom: 24px;
  padding-left: 10px;
  padding-right: 10px;
`;

const GameSingerBadgeView = styled(GameSingerBadge)`
  margin-top: 7px;
`;

const GameSingerEmptyView = styled.View``;

const SubmitButton = styled.TouchableOpacity`
  width: 100%;
  height: 52px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: solid 3px ${colors.lightMagenta};
  background-color: ${colors.pinkyPurple};
`;

const SubmitBadgeView = styled.View`
  position: absolute;
  top: -10px;
  left: 0px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const SubmitBadge = styled.View`
  width: 82px;
  height: 19px;
  justify-content: center;
  align-items: center;
  border-radius: 17px;
  border: solid 2px #99329c;
  background-color: #a83bab;
`;

const SubmitBadgeText = styled(Regular12)`
  color: ${colors.white};
`;

const SubmitButtonText = styled(Bold18)`
  color: ${colors.lightGrey};
`;

const SELECTED_SINGERS_MAX_LENGTH = 3;
const SINGER_COUMNS_LENGTH = 4;
const MOCK_ISINGER: ISinger = {
  singerName: "MOCK"
};

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

    this.state = { selectedSingers: {}, showMinimumSubmit: true };
    this.singers.initialize({ q: "" });
    this.submit =
      props.loadingProps.wrapperLoading?.(this.submit) ?? this.submit;
  }

  public async componentDidMount() {
    await this.props.singerStore.initializeRegisteredSingers();
  }

  public render() {
    const { singerViews, refresh, isRefresh } = this.singers;
    const singerViewRows = _.ceil(singerViews.length / SINGER_COUMNS_LENGTH);

    return (
      <Container bottomBackgroundColor={colors.darkTwo}>
        <InnerContainer
          scrollEnabled={false}
          enableOnAndroid={true}
          enableAutomaticScroll={false}
        >
          <BackTopBar title="가수선택" onBackPress={this.back} />
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
              data={_.times(singerViewRows * SINGER_COUMNS_LENGTH, index => {
                if (index < singerViews.length) {
                  return singerViews[index];
                }
                return MOCK_ISINGER;
              })}
              numColumns={SINGER_COUMNS_LENGTH}
              renderItem={this.renderSingerItem}
              keyExtractor={this.singerKeyExtreactor}
              refreshing={isRefresh}
              onRefresh={refresh}
              ListEmptyComponent={
                <ResultEmpty>
                  <ResultEmptyTitle>검색결과가 없습니다.</ResultEmptyTitle>
                  <ResultEmptyRow>
                    <ResultEmptyDescription>
                      음원 등록에서 찾으시는 곡을 검색해
                    </ResultEmptyDescription>
                  </ResultEmptyRow>
                  <ResultEmptyRow>
                    <HeartIcon name="heart" size={10} color={colors.red500} />
                    <ResultEmptyDescription>
                      를 눌러주시면 곡을 등록하실 수 있습니다.
                    </ResultEmptyDescription>
                  </ResultEmptyRow>
                  <RegisterSongButton onPress={this.navigateToRegisterSong}>
                    <RegisterSongButtonText>
                      노래제안 하러가기
                    </RegisterSongButtonText>
                  </RegisterSongButton>
                </ResultEmpty>
              }
            />
          </Content>
        </InnerContainer>
        {this.renderSingerSubmit}
      </Container>
    );
  }

  public get renderSingerSubmit() {
    const level: { [key in number]: GameMode } = {
      0: "RANDOM",
      1: "HARD",
      2: "NORMAL",
      3: "EASY"
    };
    const selectedSingers = this.selectedSingers;
    return (
      <Bottom>
        <GameSingerName>
          {`선택한 가수의 노래 `}
          <HighlightGameSingerName>
            {selectedSingers.length}곡
          </HighlightGameSingerName>
          {`, 랜덤 가수의 노래 `}
          <HighlightGameSingerName>
            {SINGER_COUMNS_LENGTH - selectedSingers.length}곡
          </HighlightGameSingerName>
          {` 출제`}
        </GameSingerName>
        <GameSingerBadgeGroup>
          {_.times(SINGER_COUMNS_LENGTH, index => {
            const selected = selectedSingers[index];
            if (selected) {
              return (
                <GameSingerBadgeView
                  key={`singerBadge${index}`}
                  type={"selected"}
                  name={selected.singerName}
                  onClose={_.partial(this.onSelectedItem, selected)}
                />
              );
            }
            return (
              <GameSingerBadgeView
                key={`singerBadge${index}`}
                type={
                  SELECTED_SINGERS_MAX_LENGTH > index ? "unselected" : "random"
                }
                name="랜덤"
              />
            );
          })}
          <GameSingerEmptyView />
        </GameSingerBadgeGroup>
        <SubmitButton
          onPress={_.partial(this.submit, level[this.selectedSingers.length])}
        >
          <SubmitButtonText>시작하기</SubmitButtonText>
          <SubmitBadgeView>
            <SubmitBadge>
              <SubmitBadgeText>
                {level[this.selectedSingers.length]}
              </SubmitBadgeText>
            </SubmitBadge>
          </SubmitBadgeView>
        </SubmitButton>
      </Bottom>
    );
  }

  private get singers() {
    return this.props.singerStore.registeredSingers;
  }

  private get selectedSingers() {
    const { selectedSingers } = this.state;
    return filterNull(_.values(selectedSingers));
  }

  private hasSelectedSingersByName = (name: string) => {
    return Boolean(this.state.selectedSingers[name]);
  };

  private singerKeyExtreactor = (item: ISinger, index: number) => {
    return `singer${item.singerName}${index}`;
  };

  private renderSingerItem: ListRenderItem<ISinger> = ({ item }) => {
    if (item === MOCK_ISINGER) {
      return <SearchSingerEmptyCard />;
    }
    const { singerName, artworkUrl } = item;
    const { selectedSingers } = this.state;
    return (
      <SearchSingerCardView
        selected={Boolean(selectedSingers[item.singerName])}
        image={artworkUrl ?? "https://via.placeholder.com/150"}
        name={singerName}
        onPress={_.partial(this.onSelectedItem, item)}
      />
    );
  };

  private search = (text: string) => {
    this.singers.search({ q: text });
  };

  private onSelectedItem = (item: ISinger) => {
    if (
      !this.hasSelectedSingersByName(item.singerName) &&
      this.selectedSingers.length >= SELECTED_SINGERS_MAX_LENGTH
    ) {
      return;
    }
    this.setState(
      prevState => {
        return {
          selectedSingers: {
            ...prevState.selectedSingers,
            [item.singerName]: !Boolean(
              prevState.selectedSingers[item.singerName]
            )
              ? item
              : null
          },
          showMinimumSubmit: false
        };
      },
      () => {
        const selected = Boolean(this.state.selectedSingers[item.singerName]);
        if (selected) {
          logEvent.selectedSinger(item.singerName);
        }
      }
    );
  };

  private submit = async (level: GameMode) => {
    const { showToast } = this.props.toastStore;
    const { onResult } = this.props;
    try {
      await onResult(this.selectedSingers);
      logEvent.gameStart(level);
    } catch (error) {
      showToast(error.message);
    }
  };

  private navigateToRegisterSong = () => {
    const { componentId } = this.props;
    SearchSingerScreen.open({
      componentId
    });
  };

  private back = () => {
    const { componentId } = this.props;
    pop(componentId);
  };
}

export default withScrollDirection({ sensitivity: 10 })(GameSearchSingerScreen);
