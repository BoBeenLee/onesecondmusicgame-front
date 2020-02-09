/* eslint-disable @typescript-eslint/camelcase */
import _ from "lodash";
import React, { Component, ComponentClass } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";
import { FlatListProps, FlatList, ListRenderItem } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TrackPlayer from "react-native-track-player";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import {
  Bold12,
  Bold14,
  Bold20,
  Regular12,
  Regular14,
  Bold18
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
import RegisterTrackBackDrop from "src/components/backdrop/RegisterTrackBackDrop";
import Tracks, { ITracks } from "src/stores/Tracks";
import withScrollDirection, {
  IScrollDirectionProps
} from "src/hocs/withScrollDirection";
import { ScrollDirection } from "src/utils/scrollView";
import SearchTrackCard from "src/components/card/SearchTrackCard";
import { ITrackItem } from "src/apis/soundcloud/interface";
import { makePlayStreamUri } from "src/configs/soundCloudAPI";
import {
  getUserHistoryUsingGET,
  dislikeUsingPOST,
  likeUsingPOST
} from "src/apis/like";
import { LikeHistoryResponse } from "__generate__/api";

interface IInject {
  singerStore: ISingerStore;
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
}

interface IProps extends IParams, IInject, IScrollDirectionProps {}

interface IStates {
  showTrackBackdrop: boolean;
  playingTrackItem: ITrackItem | null;
  selectedSinger: ISinger | null;
  userLikeHistories: { [key in string]: LikeHistoryResponse | null };
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
  margin-top: 34px;
`;

const Description = styled(Regular14)`
  color: ${colors.lightGrey};
  margin-top: 12px;
`;

const SearchView = styled.View`
  margin-top: 39px;
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

const TracksView = styled<ComponentClass<FlatListProps<ITrackItem>>>(FlatList)`
  padding-top: 11px;
`;

@inject(
  ({ store }: { store: IStore }): IInject => ({
    singerStore: store.singerStore,
    toastStore: store.toastStore
  })
)
@observer
class SearchSingerScreen extends Component<IProps, IStates> {
  public static open(params: IParams) {
    const { componentId, ...restParams } = params;
    return push({
      componentId,
      nextComponentId: SCREEN_IDS.SearchSingerScreen,
      params: restParams
    });
  }

  public tracks: ITracks;

  constructor(props: IProps) {
    super(props);
    this.state = {
      showTrackBackdrop: false,
      playingTrackItem: null,
      selectedSinger: null,
      userLikeHistories: {}
    };
    this.singers.initialize({ q: "" });
    this.tracks = Tracks.create();
  }

  public async componentDidMount() {
    await this.initialize();
  }

  public render() {
    const { singerViews, refresh, isRefresh } = this.singers;
    const { showTrackBackdrop, selectedSinger } = this.state;
    const {
      trackViews,
      append: appendTrack,
      refresh: trackRefresh,
      isRefresh: isTrackRefresh
    } = this.tracks;

    return (
      <>
        <Container>
          <BackTopBar title="음악 제안" onBackPress={this.back} />
          <InnerContainer
            scrollEnabled={false}
            enableOnAndroid={true}
            enableAutomaticScroll={false}
          >
            <Header>
              <Title>먼저 원하는 곡이 등록되었는지 확인해보세요</Title>
              <Description>하트가 N개 이상이 되면 등록됩니다</Description>
            </Header>
            <SearchView>
              <SearchTextInput
                placeholder="가수명을 검색해주세요"
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
                  </ResultEmpty>
                }
              />
            </Content>
          </InnerContainer>
        </Container>
        <RegisterTrackBackDrop
          showBackdrop={showTrackBackdrop}
          singerName={selectedSinger?.name ?? ""}
          totalCount={this.tracks.trackViews.length}
          ContentComponent={
            <TracksView
              data={trackViews}
              renderItem={this.renderSearchTrackItem}
              keyExtractor={this.trackKeyExtractor}
              refreshing={isTrackRefresh}
              onRefresh={trackRefresh}
              onEndReached={appendTrack}
            />
          }
          onBackgroundPress={this.onUnSelectedItem}
        />
      </>
    );
  }

  private renderSearchTrackItem: ListRenderItem<ITrackItem> = ({ item }) => {
    const { playingTrackItem } = this.state;
    const isLike = Boolean(this.state.userLikeHistories[String(item?.id)]);
    return (
      <SearchTrackCard
        thumnail={item.artwork_url ?? "https://via.placeholder.com/150"}
        title={item.title}
        author={item.user.username}
        isRegistered={false}
        isLike={isLike}
        onLikePress={_.partial(this.toggleLike, item)}
        audioType={
          `${playingTrackItem?.id}` === String(item.id) ? "play" : "stop"
        }
        onPlayToggle={_.partial(this.onPlayToggle, item)}
      />
    );
  };

  private initialize = async () => {
    const userHistories = await getUserHistoryUsingGET();
    this.setState({
      userLikeHistories: _.reduce(
        userHistories,
        (res, item) => {
          return {
            ...res,
            [String(item.trackId)]: item
          };
        },
        {}
      )
    });
  };

  private onPlayToggle = async (item: ITrackItem) => {
    const { playingTrackItem } = this.state;
    if (playingTrackItem?.id === item.id) {
      await TrackPlayer.reset();
      this.setState({ playingTrackItem: null });
      return;
    }
    if (playingTrackItem) {
      await TrackPlayer.reset();
    }
    this.setState({ playingTrackItem: item });
    const { id, stream_url, title, user, artwork_url } = item;
    await TrackPlayer.add({
      id: String(id),
      url: makePlayStreamUri(stream_url),
      title: title,
      artist: user?.username,
      artwork: artwork_url
    });
    await TrackPlayer.play();
  };

  private get singers() {
    return this.props.singerStore.allSingers;
  }

  private singerKeyExtreactor = (item: ISinger, index: number) => {
    return String(item.name) + index;
  };

  private trackKeyExtractor = (item: ITrackItem, index: number) => {
    return `${item.id}${index}`;
  };

  private renderSingerItem: ListRenderItem<ISinger> = ({ item }) => {
    const { name } = item;
    return (
      <SearchSingerCardView
        selected={false}
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
    this.setState({ showTrackBackdrop: true, selectedSinger: item }, () => {
      this.tracks.search({ q: item.name });
    });
  };

  private onUnSelectedItem = () => {
    this.setState(
      { showTrackBackdrop: false, selectedSinger: null },
      async () => {
        this.tracks.clear();
        await TrackPlayer.reset();
      }
    );
  };

  private toggleLike = async (trackItem: ITrackItem) => {
    const { showToast } = this.props.toastStore;
    const { selectedSinger } = this.state;
    const artworkUrl = trackItem?.artwork_url;
    const singerName = selectedSinger?.name ?? "";
    const title = trackItem?.title;
    const url = trackItem?.uri;
    const trackId = trackItem?.id;

    if (![title, singerName, url].some(value => !!value)) {
      return;
    }
    const isLike = Boolean(this.state.userLikeHistories[String(trackId)]);
    try {
      if (isLike) {
        dislikeUsingPOST({
          singerName,
          songUrl: url,
          trackId
        });
        this.setState(prevState => ({
          userLikeHistories: {
            ...prevState.userLikeHistories,
            [String(trackId)]: null
          }
        }));
        return;
      }
      likeUsingPOST({
        singerName,
        songUrl: url,
        trackId
      });
      this.setState(prevState => ({
        userLikeHistories: {
          ...prevState.userLikeHistories,
          [String(trackId)]: {
            artworkUrl: artworkUrl,
            singer: singerName,
            title,
            trackId
          }
        }
      }));
      showToast("노래 등록 완료되었습니다!");
    } catch (error) {
      showToast(error.message);
    }
  };

  private back = async () => {
    const { componentId } = this.props;
    pop(componentId);
  };
}

export default withScrollDirection({ sensitivity: 10 })(SearchSingerScreen);
