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
import {
  getUserHistoryUsingGET,
  dislikeUsingPOST,
  likeUsingPOST
} from "src/apis/like";
import { LikeHistoryResponse } from "__generate__/api";
import images from "src/images";
import withDisabled, { IDisabledProps } from "src/hocs/withDisabled";
import { addNewSongUsingPOST } from "src/apis/song";
import { logEvent } from "src/configs/analytics";
import { getTrackToPlayStreamUri } from "src/apis/soundcloud/playStream";

interface IInject {
  singerStore: ISingerStore;
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
}

interface IProps extends IParams, IInject, IDisabledProps {}

interface IStates {
  showTrackBackdrop: boolean;
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

const TracksView = styled<ComponentClass<FlatListProps<ISong>>>(FlatList).attrs(
  {
    contentContainerStyle: {
      flexDirection: "column",
      paddingTop: 11,
      paddingBottom: 20
    }
  }
)``;

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
      showTrackBackdrop: false,
      playingTrackItem: null,
      selectedSinger: null,
      userLikeHistories: {}
    };
    this.singers.initialize({ q: "" });
    this.tracks = Tracks.create();
    this.appendTrack = props.wrapperDisabled(this.appendTrack);

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
    const { singerViews, refresh, isRefresh } = this.singers;
    const { showTrackBackdrop, selectedSinger } = this.state;
    const {
      trackViews,
      refresh: trackRefresh,
      isRefresh: isTrackRefresh
    } = this.tracks;
    const singerViewRows = _.ceil(singerViews.length / SINGER_COUMNS_LENGTH);

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
            </Content>
          </InnerContainer>
        </Container>
        <RegisterTrackBackDrop
          showBackdrop={showTrackBackdrop}
          singerName={selectedSinger?.singerName ?? ""}
          totalCount={this.tracks.trackViews.length}
          ContentComponent={
            <TracksView
              data={trackViews}
              renderItem={this.renderSearchTrackItem}
              keyExtractor={this.trackKeyExtractor}
              refreshing={isTrackRefresh}
              onRefresh={trackRefresh}
              onEndReached={this.appendTrack}
            />
          }
          onClose={this.onUnSelectedItem}
          onBackgroundPress={this.onUnSelectedItem}
        />
      </>
    );
  }

  private appendTrack = async () => {
    await this.tracks.append();
  };

  private renderSearchTrackItem: ListRenderItem<ISong> = ({ item }) => {
    const { playingTrackItem } = this.state;
    const isLike = Boolean(this.state.userLikeHistories[String(item?.trackId)]);
    const likeCount = item.like;
    return (
      <SearchTrackCard
        thumnail={item.artworkUrl || "https://via.placeholder.com/150"}
        title={item.title}
        author={item.singer}
        isRegistered={false}
        isLike={isLike}
        likeCount={likeCount}
        onLikePress={_.partial(this.toggleLike, item)}
        audioType={
          `${playingTrackItem?.trackId}` === String(item.trackId)
            ? "play"
            : "stop"
        }
        onPlayToggle={_.partial(this.onPlayToggle, item)}
      />
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

  private singerKeyExtreactor = (item: ISinger, index: number) => {
    return `singer${item.singerName}${index}`;
  };

  private trackKeyExtractor = (item: ISong, index: number) => {
    return `${item.trackId}${index}`;
  };

  private renderSingerItem: ListRenderItem<ISinger> = ({ item }) => {
    if (item === MOCK_ISINGER) {
      return <SearchSingerEmptyCard />;
    }
    const { singerName, artworkUrl } = item;
    return (
      <SearchSingerCardView
        selected={false}
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
    this.setState({ showTrackBackdrop: true, selectedSinger: item }, () => {
      this.tracks.search({ q: item.singerName });
    });
    logEvent.selectedSinger(item.singerName);
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

  private toggleLike = async (trackItem: ISong) => {
    const { showToast } = this.props.toastStore;
    const { selectedSinger } = this.state;
    const artworkUrl = trackItem?.artworkUrl;
    const singerName = selectedSinger?.singerName ?? "";
    const title = trackItem?.title;
    const url = trackItem?.url;
    const trackId = trackItem?.trackId;

    if (![title, singerName, url].some(value => !!value)) {
      return;
    }
    const isLike = Boolean(this.state.userLikeHistories[String(trackId)]);
    try {
      if (isLike) {
        dislikeUsingPOST({
          singerName,
          songUrl: url,
          trackId: Number(trackId)
        });
        trackItem.songDislike();
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
        trackId: Number(trackId)
      });
      trackItem.songLike();
      this.setState(prevState => ({
        userLikeHistories: {
          ...prevState.userLikeHistories,
          [String(trackId)]: {
            artworkUrl: artworkUrl,
            singer: singerName,
            title,
            trackId: Number(trackId)
          }
        }
      }));
      showToast("하트가 반영되었습니다");
    } catch (error) {
      showToast(error.message);
    }
  };

  private back = async () => {
    const { componentId } = this.props;
    pop(componentId);
  };
}

export default withDisabled(SearchSingerScreen);
