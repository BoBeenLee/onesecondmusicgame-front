import _ from "lodash";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";

import TrackPlayer from "react-native-track-player";

import { IStore } from "src/stores/Store";
import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold18, Bold20, Bold14 } from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { push, popTo, pop } from "src/utils/navigator";
import BackTopBar from "src/components/topbar/BackTopBar";
import colors from "src/styles/colors";
import { IToastStore } from "src/stores/ToastStore";
import ButtonLoading from "src/components/loading/ButtonLoading";
import Song, { ISong } from "src/stores/model/Song";
import { tracksById } from "src/apis/soundcloud/tracks";
import { getDeviceWidth } from "src/utils/device";
import { getTrackToPlayStreamUri } from "src/apis/soundcloud/playStream";
import images from "src/images";
import IconButton from "src/components/button/IconButton";
import SoundCloudWaveProgress from "src/components/progress/SoundCloudWaveProgress";
import { toTimeMMSS } from "src/utils/date";
import { filterEmpty } from "src/utils/common";
import { addSongHighlight } from "src/apis/songHighlight";

interface IInject {
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
  song: () => ISong;
}

interface IProps extends IInject, IParams {
  parentComponentId: string;
  uri: string;
  waveformUrl: string;
  duration: number;
}

interface IStates {
  currentPosition: number;
  playState: "play" | "pause";
  highlightSeconds: Record<number, number>;
}

const Container = styled(ContainerWithStatusBar)`
  flex: 1;
  flex-direction: column;
`;

const ScrollView = styled.ScrollView``;

const Header = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;
  padding-left: 30px;
  padding-right: 30px;
`;

const SongTitle = styled(Bold18)`
  color: ${colors.lavender};
  text-align: center;
`;

const Content = styled.View`
  flex-direction: column;
  padding-top: 30px;
`;

const SelectedHighlightGroup = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 42px;
  padding-left: 20px;
  padding-right: 20px;
`;

const SelectedEmptyHightlightItem = styled.Image`
  width: 93px;
  height: 42px;
`;

const SelectedHighlightItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 93px;
  height: 42px;
`;

const SelectedHighlightBackground = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const SelectedHighlightPlayIcon = styled.Image`
  width: 20px;
  height: 20px;
  resize-mode: contain;
  margin-right: 6px;
`;

const SelectedHighlightCancelButton = styled(IconButton)`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 21px;
  height: 21px;
`;

const SelectedHighlightText = styled(Bold18)`
  color: ${colors.pinkyPurpleThree};
`;

const PlayerButtonGroup = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 31px;
`;

const PlaybackButton = styled.TouchableOpacity`
  width: 35px;
  height: 35px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PlaybackText = styled(Bold14)`
  color: ${colors.pinkyPurple};
  margin-top: 5px;
`;

const PlayButton = styled(IconButton)`
  width: 36px;
  height: 34px;
  margin-left: 28px;
  margin-right: 24px;
`;

const PlaybackIcon = styled.Image`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  resize-mode: contain;
`;

const Footer = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 60px;
  padding-bottom: 30px;
`;

const RegisterSongButtonLoading = styled(ButtonLoading)``;

const RegisterSongButton = styled.TouchableOpacity`
  width: 278px;
  padding-vertical: 18px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.pinkyPurple};
  border-radius: 14px;
`;

const RegisterSongButtonText = styled(Bold20)<{ disabled: boolean }>`
  color: ${({ disabled }) => (disabled ? colors.lavenderPink : colors.white)};
`;

const MAX_SELECTED_COUNT = 3;

@inject(
  ({ store }: { store: IStore }): IInject => ({
    toastStore: store.toastStore
  })
)
@observer
class RegisterSongScreen extends Component<IProps, IStates> {
  public static async open(params: IParams) {
    const { componentId, song } = params;
    const selectedSong = song();
    const { trackId, title, singer, artworkUrl } = selectedSong;
    const [trackResponse, streamUri] = await Promise.all([
      tracksById({ id: trackId }),
      getTrackToPlayStreamUri(trackId)
    ]);
    if (!streamUri) {
      return;
    }
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: String(trackId),
      url: streamUri,
      title: title,
      artist: singer,
      artwork: artworkUrl
    });
    push({
      componentId,
      nextComponentId: SCREEN_IDS.RegisterSongScreen,
      params: {
        parentComponentId: params.componentId,
        song,
        uri: trackResponse.uri,
        waveformUrl: trackResponse.waveform_url,
        duration: (trackResponse.duration ?? 0) / 1000
      }
    });
  }

  public song: ISong = Song.create({
    artworkUrl:
      "https://w.namu.la/s/8b637f372ec50ccdf6e2367a8686c3798e27ad3ec80357f3eedb7cb3d000190916d13f237f5b16c781302b0adcee6e3a9d7fb5482c139cc04de731286c910c6069fd26d051623921dc0636232779dfdece6c2feb6c2fc8ea2a4f6cab62e280054ec4363a7f8e6639714ecbbbda718f7c",
    like: 0,
    singer: "BoA",
    title: "아틀란티스 소녀",
    trackId: "691589422",
    url:
      "https://api-v2.soundcloud.com/media/soundcloud:tracks:691589422/61e5b695-0b07-44b9-bbda-e025eb1461d6/stream/progressive"
  });

  constructor(props: IProps) {
    super(props);

    if (props.song) {
      this.song = props.song();
    }
    this.state = {
      currentPosition: 0,
      highlightSeconds: {},
      playState: "pause"
    };
  }

  public render() {
    const { waveformUrl, duration } = this.props;
    const { currentPosition, highlightSeconds } = this.state;
    const { title, singer } = this.song;
    return (
      <Container>
        <BackTopBar title="노래 구간선택" onBackPress={this.back} />
        <ScrollView>
          <Header>
            <SongTitle>
              {singer} - {title}
            </SongTitle>
          </Header>
          <Content>
            {waveformUrl ? (
              <SoundCloudWaveProgress
                currentPosition={currentPosition}
                waveformUrl={waveformUrl}
                duration={duration}
                width={getDeviceWidth()}
                height={100}
                onSelected={this.onSelected}
                onRegisterHighlightPlay={this.onRegisterHighlightPlay}
                onChangeCurrentPosition={this.onChangeCurrentPosition}
              />
            ) : null}
          </Content>
          <Footer>
            <SelectedHighlightGroup>
              {_.times(MAX_SELECTED_COUNT, index => {
                if (!_.isNil(highlightSeconds[index])) {
                  return (
                    <SelectedHighlightItem key={`selected${index}`}>
                      <SelectedHighlightBackground
                        source={images.bgSelectedHighlightPlay}
                      />
                      <SelectedHighlightPlayIcon
                        source={images.icSelectedHighlightPlay}
                      />
                      <SelectedHighlightText>
                        {toTimeMMSS(highlightSeconds[index])}
                      </SelectedHighlightText>
                      <SelectedHighlightCancelButton
                        source={images.btnSelectedClose}
                        onPress={_.partial(this.onRemoveHighlightPlay, index)}
                      />
                    </SelectedHighlightItem>
                  );
                }
                return (
                  <SelectedEmptyHightlightItem
                    key={`selected${index}`}
                    source={images.bgSelectedEmptyHighlight}
                  />
                );
              })}
            </SelectedHighlightGroup>
            <PlayerButtonGroup>
              <PlaybackButton onPress={this.onPlaybackBackward}>
                <PlaybackIcon source={images.btnRegisterBackward} />
                <PlaybackText>1s</PlaybackText>
              </PlaybackButton>
              <PlayButton
                source={images.btnRegisterPlay}
                onPress={this.onPlayToggle}
              />
              <PlaybackButton onPress={this.onPlaybackForward}>
                <PlaybackIcon source={images.btnRegisterForward} />
                <PlaybackText>1s</PlaybackText>
              </PlaybackButton>
            </PlayerButtonGroup>
            {this.renderRegisterSongButton}
          </Footer>
        </ScrollView>
      </Container>
    );
  }

  private onSelected = async (percentage: number) => {
    const { duration } = this.props;
    await TrackPlayer.seekTo(percentage * duration);
    this.setState({
      currentPosition: percentage * duration
    });
  };

  private get selectedHighlightSecondsLength() {
    return _.values(this.state.highlightSeconds).length;
  }

  private onRegisterHighlightPlay = (highlighSeconds: number) => {
    if (this.selectedHighlightSecondsLength >= MAX_SELECTED_COUNT) {
      return;
    }
    this.setState(prevState => {
      return {
        highlightSeconds: {
          ...prevState.highlightSeconds,
          [this.selectedHighlightSecondsLength]: highlighSeconds
        }
      };
    });
  };

  private onRemoveHighlightPlay = (index: number) => {
    this.setState(prevState => {
      return {
        highlightSeconds: _.reduce(
          _.values(_.omit(prevState.highlightSeconds, [index])),
          (res, item, index) => {
            return {
              ...res,
              [index]: item
            };
          },
          {}
        )
      };
    });
  };

  private get renderRegisterSongButton() {
    return (
      <RegisterSongButtonLoading>
        {({ loadingProps }) => {
          return (
            <RegisterSongButton
              disabled={this.disabledSubmit}
              onPress={
                loadingProps?.wrapperLoading?.(this.register) ?? this.register
              }
            >
              <RegisterSongButtonText disabled={this.disabledSubmit}>
                노래 구간 추가하기
              </RegisterSongButtonText>
            </RegisterSongButton>
          );
        }}
      </RegisterSongButtonLoading>
    );
  }

  private onChangeCurrentPosition = (currentPosition: number) => {
    this.setState({
      currentPosition: currentPosition
    });
  };

  private onPlaybackForward = async () => {
    const { duration } = this.props;
    const { currentPosition } = this.state;
    if (currentPosition + 1 >= duration) {
      return;
    }
    await TrackPlayer.seekTo(currentPosition + 1);
    this.setState({
      currentPosition: currentPosition + 1
    });
  };

  private onPlaybackBackward = async () => {
    const { currentPosition } = this.state;
    if (currentPosition - 1 < 0) {
      return;
    }
    await TrackPlayer.seekTo(currentPosition - 1);
    this.setState({
      currentPosition: currentPosition - 1
    });
  };

  private onPlayToggle = async () => {
    const { playState } = this.state;
    if (playState === "play") {
      this.setState(
        {
          playState: "pause"
        },
        async () => {
          await TrackPlayer.pause();
        }
      );
      return;
    }
    this.setState(
      {
        playState: "play"
      },
      async () => {
        await TrackPlayer.play();
      }
    );
  };

  private get disabledSubmit() {
    return this.selectedHighlightSecondsLength <= 0;
  }

  private register = async () => {
    const { showToast } = this.props.toastStore;
    const { uri } = this.props;
    const { highlightSeconds } = this.state;
    const { title, singer } = this.song;

    if (![title, singer, uri].some(value => !!value)) {
      return;
    }
    try {
      await addSongHighlight({
        url: uri ?? "",
        highlightSeconds: filterEmpty(_.values(highlightSeconds))
      });
      this.goHome();
      showToast("노래가 등록 완료되었습니다!");
    } catch (error) {
      showToast(error.message);
    }
  };

  private back = () => {
    const { componentId } = this.props;
    TrackPlayer.reset();
    pop(componentId);
  };

  private goHome = () => {
    const { parentComponentId } = this.props;
    TrackPlayer.reset();
    popTo(parentComponentId);
  };
}

export default RegisterSongScreen;
