/* eslint-disable @typescript-eslint/camelcase */
import _ from "lodash";
import React, { Component, ComponentClass } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";
import { FlatListProps, FlatList, ListRenderItem } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TrackPlayer, {
  addEventListener,
  State,
  EmitterSubscription
} from "react-native-track-player";

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
import { ISong } from "src/stores/model/Song";
import SearchSingerCard from "src/components/card/SearchSingerCard";
import { filterNull } from "src/utils/common";
import { IStore } from "src/stores/Store";
import { ISingerStore } from "src/stores/SingerStore";
import { IToastStore } from "src/stores/ToastStore";
import BackTopBar from "src/components/topbar/BackTopBar";
import RegisterTrackBackDrop from "src/components/backdrop/RegisterTrackBackDrop";
import Tracks, { ITracks } from "src/stores/Tracks";
import SearchTrackCard from "src/components/card/SearchTrackCard";
import { getUserHistoryUsingGET } from "src/apis/like";
import { LikeHistoryResponse } from "__generate__/api";
import images from "src/images";
import withDisabled, { DisabledProps } from "src/hocs/withDisabled";
import { logEvent } from "src/configs/analytics";
import { getTrackToPlayStreamUri } from "src/apis/soundcloud/playStream";
import RegisterSongScreen from "src/screens/song/RegisterSongScreen";
import { LoadingProps } from "src/hocs/withLoading";

interface IInject {
  singerStore: ISingerStore;
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
}

interface IProps extends IParams, IInject, DisabledProps, LoadingProps {}

interface IStates {
  showSearchTrack: boolean;
  playingTrackItem: ISong | null;
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
  margin-top: 25px;
`;

const Description = styled(Regular14)`
  color: ${colors.lightGrey};
  margin-top: 5px;
`;

const SearchView = styled.View`
  margin-top: 39px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const SearchInput = styled(SearchTextInput)`
  width: 293px;
`;

const Content = styled.View`
  flex: 1;
  padding-horizontal: 16px;
  margin-top: 20px;
`;

const SearchSingers = styled<ComponentClass<FlatListProps<ISinger>>>(FlatList)`
  flex: 1;
  width: 100%;
`;

const SearchSingerCardView = styled(SearchSingerCard)`
  padding-left: 56px;
  margin-bottom: 16px;
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

const ResultEmptyDescriptionRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ResultEmptyDescriptionHeart = styled.Image`
  width: 11px;
  height: 10px;
`;

const ResultEmptyDescription = styled(Regular12)`
  color: ${colors.lightGreyTwo};
`;

const TrackTotal = styled(Bold12)`
  width: 353px;
  color: ${colors.lightGreyTwo};
  align-self: center;
`;

const TracksView = styled<ComponentClass<FlatListProps<ISong>>>(FlatList).attrs(
  {
    contentContainerStyle: {
      flexDirection: "column",
      paddingBottom: 20
    }
  }
)``;

const SearchTrackView = styled.View`
  flex-direction: column;
  align-items: center;
`;

const SearchTrackItem = styled(SearchTrackCard)`
  max-width: 353px;
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
  public playbackStateListener: EmitterSubscription;

  constructor(props: IProps) {
    super(props);
    this.state = {
      showSearchTrack: false,
      playingTrackItem: null,
      selectedSinger: null,
      userLikeHistories: {}
    };
    this.singers.initialize({ q: "" });
    this.tracks = Tracks.create();
    this.appendTrack = props.disabledProps.wrapperDisabled(this.appendTrack);
    this.onSelectedSong =
      props.loadingProps.wrapperLoading?.(this.onSelectedSong) ??
      this.onSelectedSong;

    this.playbackStateListener = addEventListener(
      "playback-state",
      (state: State) => {
        if (state === "paused") {
          this.setState({ playingTrackItem: null });
        }
      }
    );
  }

  public async componentDidMount() {
    await this.initialize();
  }

  public componentWillUnmount() {
    this.playbackStateListener?.remove();
  }

  public render() {
    const { showSearchTrack } = this.state;
    return (
      <>
        <Container>
          <BackTopBar title="노래 제안" onBackPress={this.back} />
          <InnerContainer
            scrollEnabled={false}
            enableOnAndroid={true}
            enableAutomaticScroll={false}
          >
            <Header>
              <Title>알쏭달쏭에 1초 노래 구간을 제안해주세요!</Title>
              <Description>
                제안한 1초 노래 구간이 등록되어 문제로 출제됩니다.
              </Description>
            </Header>
            <SearchView>
              <SearchInput
                placeholder="가수명을 검색해주세요"
                onChangeInput={this.search}
                onSearch={this.search}
                onFocus={this.onSearchFocus}
              />
            </SearchView>
            <Content>
              {showSearchTrack ? this.renderTracks : this.renderSearch}
            </Content>
          </InnerContainer>
        </Container>
      </>
    );
  }

  private get renderSearch() {
    const { singerViews, refresh, isRefresh } = this.singers;
    return (
      <React.Fragment>
        <SearchSingers
          data={singerViews}
          renderItem={this.renderSingerItem}
          keyExtractor={this.singerKeyExtreactor}
          refreshing={isRefresh}
          onRefresh={refresh}
          ListEmptyComponent={
            <ResultEmpty>
              <ResultEmptyTitle>검색결과가 없습니다.</ResultEmptyTitle>
              <ResultEmptyDescription>
                음원 등록에서 찾으시는 곡을 검색해
              </ResultEmptyDescription>
              <ResultEmptyDescriptionRow>
                <ResultEmptyDescriptionHeart source={images.miniHeart} />
                <ResultEmptyDescription>
                  를 눌러주시면 곡을 등록하실 수 있습니다.
                </ResultEmptyDescription>
              </ResultEmptyDescriptionRow>
            </ResultEmpty>
          }
        />
      </React.Fragment>
    );
  }

  private onSearchFocus = () => {
    this.setState({
      showSearchTrack: false
    });
  };

  private singerKeyExtreactor = (item: ISinger, index: number) => {
    return `singer${item.singerName}${index}`;
  };

  private renderSingerItem: ListRenderItem<ISinger> = ({ item }) => {
    const { singerName } = item;
    const { q } = this.singers.variables;
    return (
      <SearchSingerCardView
        name={singerName}
        searchWord={q}
        onPress={_.partial(this.onSelectedSinger, item)}
      />
    );
  };

  private search = (text: string) => {
    this.singers.search({ q: text });
  };

  private get renderTracks() {
    const {
      trackViews,
      refresh: trackRefresh,
      isRefresh: isTrackRefresh
    } = this.tracks;

    return (
      <React.Fragment>
        <TrackTotal>전체 {this.tracks.trackViews.length}</TrackTotal>
        <TracksView
          data={trackViews}
          renderItem={this.renderSearchTrackItem}
          keyExtractor={this.trackKeyExtractor}
          refreshing={isTrackRefresh}
          onRefresh={trackRefresh}
          onEndReached={this.appendTrack}
        />
      </React.Fragment>
    );
  }

  private appendTrack = async () => {
    await this.tracks.append();
  };

  private renderSearchTrackItem: ListRenderItem<ISong> = ({ item }) => {
    const { playingTrackItem } = this.state;
    return (
      <SearchTrackView>
        <SearchTrackItem
          thumnail={item.artworkUrl || "https://via.placeholder.com/150"}
          title={item.title}
          author={item.singer}
          isRegistered={false}
          audioType={
            `${playingTrackItem?.trackId}` === String(item.trackId)
              ? "play"
              : "stop"
          }
          onSelected={_.partial(this.onSelectedSong, item)}
          onPlayToggle={_.partial(this.onPlayToggle, item)}
        />
      </SearchTrackView>
    );
  };

  private initialize = async () => {
    await TrackPlayer.reset();
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

  private onSelectedSong = async (item: ISong) => {
    const { componentId } = this.props;
    await RegisterSongScreen.open({
      componentId,
      song: () => item
    });
  };

  private onPlayToggle = async (item: ISong) => {
    const { playingTrackItem } = this.state;
    if (playingTrackItem?.trackId === item.trackId) {
      await TrackPlayer.reset();
      this.setState({ playingTrackItem: null });
      return;
    }
    if (playingTrackItem) {
      await TrackPlayer.reset();
    }
    this.setState({ playingTrackItem: item });
    const { trackId, url, title, singer, artworkUrl } = item;
    const streamUri = await getTrackToPlayStreamUri(trackId);
    if (!streamUri) {
      return;
    }
    await TrackPlayer.add({
      id: String(trackId),
      url: streamUri,
      title: title,
      artist: singer,
      artwork: artworkUrl
    });
    await TrackPlayer.play();
  };

  private get singers() {
    return this.props.singerStore.allSingers;
  }

  private trackKeyExtractor = (item: ISong, index: number) => {
    return `${item.trackId}${index}`;
  };

  private onSelectedSinger = (item: ISinger) => {
    this.setState({ showSearchTrack: true, selectedSinger: item }, () => {
      this.tracks.search({ q: item.singerName });
    });
    logEvent.selectedSinger(item.singerName);
  };

  private back = async () => {
    const { componentId } = this.props;
    pop(componentId);
  };
}

export default withDisabled(SearchSingerScreen);
