import { InteractionManager, Clipboard } from "react-native";
import { Item } from "__generate__/api";
import _ from "lodash";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TrackPlayer from "react-native-track-player";
import LinearGradient from "react-native-linear-gradient";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import {
  Bold12,
  Bold17,
  Bold20,
  Bold18,
  Bold27,
  Bold36,
  Regular20
} from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { push, popTo, getCurrentComponentId } from "src/utils/navigator";
import CircleCheckGroup from "src/components/icon/CircleCheckGroup";
import LimitTimeProgress from "src/components/progress/LimitTimeProgress";
import colors from "src/styles/colors";
import OSMGCarousel, { ICarousel } from "src/components/carousel/OSMGCarousel";
import GameAudioPlayer from "src/components/player/GameAudioPlayer";
import OSMGTextInput from "src/components/input/OSMGTextInput";
import { IPopupProps } from "src/hocs/withPopup";
import withDisabled, { IDisabledProps } from "src/hocs/withDisabled";
import ChargeFullHeartPopup from "src/components/popup/ChargeFullHeartPopup";
import { IAuthStore } from "src/stores/AuthStore";
import { IToastStore } from "src/stores/ToastStore";
import { IStore } from "src/stores/Store";
import GameResultScreen from "src/screens/game/GameResultScreen";
import GameSearchSingerScreen from "src/screens/game/GameSearchSingerScreen";
import { ISinger } from "src/apis/singer";
import { AdmobUnitID, loadAD, showAD } from "src/configs/admob";
import { rewardForWatchingAdUsingPOST, RewardType } from "src/apis/reward";
import GamePlayHighlights, {
  IGamePlayHighlightItem,
  IGamePlayHighlights,
  makeGamePlayHighlights
} from "src/stores/GamePlayHighlights";
import GamePlayTutorialOverlay from "src/screens/tutorial/GamePlayTutorialOverlay";
import XEIcon from "src/components/icon/XEIcon";
import SkipIcon from "src/components/icon/SkipIcon";
import images from "src/images";
import IconButton from "src/components/button/IconButton";
import ConfirmPopup from "src/components/popup/ConfirmPopup";
import { makePlayStreamUriByTrackId } from "src/configs/soundCloudAPI";
import { delay } from "src/utils/common";
import MainScreen from "src/screens/MainScreen";
import GainFullHeartPopup from "src/components/popup/GainFullHeartPopup";
import GameReadyPlayOverlay from "src/screens/game/GameReadyPlayOverlay";

interface IInject {
  authStore: IAuthStore;
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
  heartCount: number;
}

interface IProps extends IInject, IPopupProps, IDisabledProps {
  componentId: string;
  selectedSingers: ISinger[];
  gamePlayHighlights: () => IGamePlayHighlights;
}

interface IStates {
  currentStepStatus: "play" | "stop" | "answer";
  songAnswerInput: string;
  songAnswerSeconds: number;
}

interface ICarouselItem extends ICarousel, IGamePlayHighlightItem {}

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
  padding-top: 20px;
  padding-bottom: 20px;
  padding-horizontal: 16px;
`;

const GameStopButton = styled(IconButton)`
  position: absolute;
  top: 12px;
  right: 15px;
  width: 38px;
  height: 38px;
`;

const GamePlayStep = styled(CircleCheckGroup)`
  margin-bottom: 32px;
`;

const GamePlayers = styled(OSMGCarousel)``;

const GamePlayerView = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const GameContent = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding-top: 70px;
  padding-horizontal: 70px;
`;

const SongInput = styled.View`
  width: 100%;
  height: 40px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-bottom-width: 4px;
  border-bottom-color: ${colors.blueberry};
`;

const SongTextInput = styled(OSMGTextInput).attrs({
  fontType: "BOLD",
  focusStyle: { color: colors.paleGrey }
})`
  color: ${colors.paleGrey};
  font-size: 22px;
  text-align: center;
`;

const AnswerContainer = styled(LinearGradient).attrs({
  colors: [colors.darkIndigo, colors.almostBlack]
})`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: white;
`;

const AnswerStatus = styled.Image`
  width: 227px;
  height: 225px;
`;

const AnswerView = styled.View`
  flex: 1;
  align-items: center;
  padding-top: 60px;
`;

const AnswerText = styled(Bold36)`
  text-align: center;
  color: ${colors.robinEggBlue};
  margin-bottom: 51px;
`;

const AnswerSingerText = styled(Regular20)`
  text-align: center;
  color: ${colors.palePurple};
  margin-bottom: 8px;
`;

const AnswerSongText = styled(Bold27)`
  text-align: center;
  color: ${colors.lavender};
`;

const Footer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  padding-horizontal: 14px;
  padding-bottom: 31px;
`;

const AnswerContent = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding-top: 38px;
`;

const AnswerButton = styled.TouchableOpacity`
  flex: 1;
  height: 56px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: solid 3px ${colors.lightMagenta};
  background-color: ${colors.pinkyPurple};
  margin-right: 7px;
`;

const AnswerButtonText = styled(Bold20)`
  color: ${colors.white};
`;

const CorrectBackground = styled.Image`
  position: absolute;
  top: 55px;
  left: 0px;
  width: 100%;
  height: 100%;
`;

const NextEmptyView = styled.View``;

const NextStepGroup = styled.View`
  flex-direction: column;
  align-items: flex-end;
`;

const NextStepButton = styled.TouchableOpacity`
  width: 173px;
  height: 56px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 14px;
  border: solid 3px ${colors.lightBlueGrey};
  background-color: ${colors.paleLavender};
`;

const NextStepButtonText = styled(Bold20)`
  color: ${colors.pinkyPurple};
  margin-right: 11px;
`;

const NextStepArrowIcon = styled(XEIcon)``;

const NextStepCaption = styled(Bold17)`
  text-align: center;
  color: ${colors.lightBlueGrey};
  margin-bottom: 12px;
`;

const SkipButton = styled.TouchableOpacity`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SkipButtonText = styled(Bold12)`
  color: ${colors.pinkyPurpleThree};
  margin-top: 2px;
`;

const SkipBadge = styled.View`
  position: absolute;
  top: -5px;
  right: -5px;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 11px;
  background-color: ${colors.pinkyPurple};
`;

const SkipBadgeText = styled(Bold18)`
  color: ${colors.paleLavender};
`;

const HiddenAnswerCopyButton = styled.TouchableWithoutFeedback``;
const HiddenAnswerCopyButtonView = styled.View`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 20px;
  height: 20px;
`;

const DEFAULT_LIMIT_TIME = 40;
const NEXT_STEP_SECONDS = 5000;

@inject(
  ({ store }: { store: IStore }): IInject => ({
    authStore: store.authStore,
    toastStore: store.toastStore
  })
)
@observer
class GamePlayScreen extends Component<IProps, IStates> {
  public static async open(params: IParams) {
    if (params.heartCount === 0) {
      throw new Error("하트가 부족합니다.");
    }
    const gamePlayHighlights = await makeGamePlayHighlights([]);
    return push({
      componentId: params.componentId,
      nextComponentId: SCREEN_IDS.GamePlayScreen,
      params: {
        selectedSingers: [],
        gamePlayHighlights: () => gamePlayHighlights
      },
      options: {
        popGesture: false
      }
    });
  }

  public static openSelectedSingers(params: IParams) {
    if (params.heartCount === 0) {
      throw new Error("하트가 부족합니다.");
    }
    GameSearchSingerScreen.open({
      componentId: params.componentId,
      onResult: async (selectedSingers: ISinger[]) => {
        const gamePlayHighlights = await makeGamePlayHighlights(
          selectedSingers
        );
        push({
          componentId: getCurrentComponentId(),
          nextComponentId: SCREEN_IDS.GamePlayScreen,
          params: {
            selectedSingers,
            gamePlayHighlights: () => gamePlayHighlights
          },
          options: {
            popGesture: false
          }
        });
      }
    });
  }

  public gamePlayHighlights = GamePlayHighlights.create({});
  public gamePlayersRef = React.createRef<OSMGCarousel<any>>();
  public intervalId: any;

  constructor(props: IProps) {
    super(props);
    this.state = {
      currentStepStatus: "stop",
      songAnswerInput: "",
      songAnswerSeconds: DEFAULT_LIMIT_TIME
    };
    this.nextStep = props.wrapperDisabled(this.nextStep, "nextStep");
    this.useSkipItem = props.wrapperDisabled(this.useSkipItem, "useSkipItem");
    this.submitAnswer = props.wrapperDisabled(
      this.submitAnswer,
      "submitAnswer"
    );
    if (props.gamePlayHighlights) {
      this.gamePlayHighlights = props.gamePlayHighlights();
    }
    loadAD(AdmobUnitID.HeartReward, ["game", "quiz"], {
      onRewarded: this.onRewarded
    });

    const navigateToReadyPlay = () => {
      GameReadyPlayOverlay.open({
        onAfterClose: () => {
          this.setState(
            {
              currentStepStatus: "play",
              songAnswerInput: "",
              songAnswerSeconds: DEFAULT_LIMIT_TIME
            },
            async () => {
              await this.readyForPlay();
              this.intervalId = setInterval(async () => {
                const { songAnswerSeconds, currentStepStatus } = this.state;
                const { showToast } = this.props.toastStore;
                if (currentStepStatus !== "play") {
                  return;
                }
                if (songAnswerSeconds === 0) {
                  const { answer, isAnswer } = this.gamePlayHighlights;
                  const { songAnswerInput } = this.state;
                  let isUserAnswer = false;
                  try {
                    isUserAnswer = await isAnswer(songAnswerInput);
                  } catch (error) {
                    showToast(error.message);
                  }
                  answer(isUserAnswer, songAnswerInput, songAnswerSeconds);
                  await this.beforeNextStep();
                  return;
                }
                this.setState({
                  songAnswerSeconds: songAnswerSeconds - 1
                });
              }, 1000);
            }
          );
        }
      });
    };
    GamePlayTutorialOverlay.open({
      onAfterClose: navigateToReadyPlay
    });
  }

  public componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  public render() {
    const { currentStepStatus } = this.state;
    return (
      <Container>
        <InnerContainer enableOnAndroid={true} enableAutomaticScroll={false}>
          {this.renderGamePlay}
          {["play", "stop"].some(status => status === currentStepStatus)
            ? null
            : this.renderAnswer}
        </InnerContainer>
        <HiddenAnswerCopyButton onPress={this.copyAnswer}>
          <HiddenAnswerCopyButtonView />
        </HiddenAnswerCopyButton>
      </Container>
    );
  }

  private get renderGamePlay() {
    const { currentStep, gamePlayStepStatuses } = this.gamePlayHighlights;
    const { songAnswerInput, songAnswerSeconds } = this.state;
    const userItem = this.props.authStore.user?.userItemsByItemType(
      Item.ItemTypeEnum.SKIP
    );
    return (
      <>
        <Header>
          <GamePlayStep circles={gamePlayStepStatuses} />
          <LimitTimeProgress
            key={`${currentStep}`}
            seconds={songAnswerSeconds}
            totalSeconds={DEFAULT_LIMIT_TIME}
          />
          <GameStopButton source={images.pauseButton} onPress={this.exit} />
        </Header>
        <GamePlayers
          scrollEnabled={false}
          ref={this.gamePlayersRef}
          data={this.gameHighlightViews}
          itemWidth={240}
          renderItem={this.renderItem}
        />
        <GameContent>
          <SongInput>
            <SongTextInput
              placeholder="노래명을 맞춰주세요!"
              placeholderTextColor={colors.blueyGrey}
              value={songAnswerInput}
              onChangeText={this.onSongAnswerChangeText}
              onSubmitEditing={this.submitAnswer}
            />
          </SongInput>
        </GameContent>
        <Footer>
          <AnswerButton onPress={this.submitAnswer}>
            <AnswerButtonText>입력확인</AnswerButtonText>
          </AnswerButton>
          <SkipButton
            disabled={(userItem?.count ?? 0) === 0}
            onPress={this.useSkipItem}
          >
            <SkipIcon />
            <SkipButtonText>SKIP</SkipButtonText>
            <SkipBadge>
              <SkipBadgeText>{userItem?.count ?? 0}</SkipBadgeText>
            </SkipBadge>
          </SkipButton>
        </Footer>
      </>
    );
  }

  private get renderAnswer() {
    const {
      currentGameHighlight,
      gamePlayStepStatuses,
      isFinish
    } = this.gamePlayHighlights;
    const { songAnswerSeconds } = this.state;
    const isAnswer = Boolean(currentGameHighlight?.isUserAnswer);
    return (
      <AnswerContainer>
        <CorrectBackground source={images.bgCorrectMirrorballLight} />
        <Header>
          <GamePlayStep circles={gamePlayStepStatuses} />
          <LimitTimeProgress
            key={`answer`}
            seconds={songAnswerSeconds}
            totalSeconds={DEFAULT_LIMIT_TIME}
          />
          <GameStopButton source={images.pauseButton} onPress={this.exit} />
        </Header>
        <AnswerContent>
          {isAnswer ? (
            <AnswerStatus source={images.correctCD} />
          ) : (
            <AnswerStatus source={images.wrongCD} />
          )}
          <AnswerView>
            {isAnswer ? (
              <AnswerText>정답입니다~!!</AnswerText>
            ) : (
              <AnswerText>오답입니다ㅠㅠ</AnswerText>
            )}
            <AnswerSingerText>
              {currentGameHighlight?.singer ?? ""}
            </AnswerSingerText>
            <AnswerSongText>{currentGameHighlight?.title ?? ""}</AnswerSongText>
          </AnswerView>
        </AnswerContent>
        <Footer>
          <NextEmptyView />
          {!isFinish ? (
            <NextStepGroup>
              <NextStepCaption>5초 뒤 다음 문제</NextStepCaption>
              <NextStepButton onPress={_.partial(this.nextStep, false)}>
                <NextStepButtonText>다음 문제</NextStepButtonText>
                <NextStepArrowIcon
                  name="angle-right"
                  size={16}
                  color={colors.pinkyPurpleThree}
                />
              </NextStepButton>
            </NextStepGroup>
          ) : null}
        </Footer>
      </AnswerContainer>
    );
  }

  private get gameHighlightViews(): ICarouselItem[] {
    return _.map(this.gamePlayHighlights.gameHighlightViews, item => ({
      ...item,
      key: String(item.id)
    }));
  }

  private onSongAnswerChangeText = (text: string) => {
    this.setState({ songAnswerInput: text });
  };

  private renderItem = (props: { item: ICarouselItem; index: number }) => {
    return (
      <GamePlayerView key={`gamePlayer${props.index}`}>
        <GameAudioPlayer
          size={200}
          onPlay={_.partial(this.onPlayItem, props.item)}
        />
      </GamePlayerView>
    );
  };

  private onPlayItem = async (item: IGamePlayHighlightItem) => {
    await TrackPlayer.seekTo(_.round((item.millisecond ?? 0) / 1000));
    await TrackPlayer.play();
    await delay(2000);
    await TrackPlayer.pause();
  };

  private useSkipItem = async () => {
    const {
      isFinish,
      playToken,
      currentGameHighlight
    } = this.gamePlayHighlights;
    const userItem = this.props.authStore.user?.userItemsByItemType(
      Item.ItemTypeEnum.SKIP
    );
    userItem?.useItemType?.({
      playToken,
      highlightId: currentGameHighlight?.id ?? 0
    });
    if (isFinish) {
      this.setState({ currentStepStatus: "stop" });
      this.onFinishPopup();
      return;
    }
    await this.nextStep();
  };

  private submitAnswer = async () => {
    const { answer, currentGameHighlight, isAnswer } = this.gamePlayHighlights;
    const { songAnswerInput, songAnswerSeconds } = this.state;
    const { showToast } = this.props.toastStore;

    if (currentGameHighlight === null) {
      showToast("게임 플레이곡이 없습니다");
      return;
    }
    if (_.isEmpty(songAnswerInput)) {
      return;
    }
    try {
      const isUserAnswer = await isAnswer(songAnswerInput);
      if (!isUserAnswer) {
        showToast("오답입니다ㅠㅜ");
        return;
      }
      answer(isUserAnswer, songAnswerInput, songAnswerSeconds);
      await this.beforeNextStep();
    } catch (error) {
      showToast(error.message);
    }
  };

  private beforeNextStep = async () => {
    const { isFinish } = this.gamePlayHighlights;
    this.setState({
      currentStepStatus: "answer"
    });
    if (isFinish) {
      this.onFinishPopup();
      return;
    }
    await delay(NEXT_STEP_SECONDS);
    if (this.state.currentStepStatus === "play") {
      return;
    }
    this.nextStep();
  };

  private nextStep = () => {
    this.setState(
      {
        currentStepStatus: "play",
        songAnswerInput: "",
        songAnswerSeconds: DEFAULT_LIMIT_TIME
      },
      () => {
        InteractionManager.runAfterInteractions(async () => {
          this.gamePlayersRef.current?.snapToNext();
          this.gamePlayHighlights.nextStep();
          await this.readyForPlay();
        });
      }
    );
  };

  private readyForPlay = async () => {
    const currentGameHighlight = this.gamePlayHighlights.currentGameHighlight;
    if (currentGameHighlight === null) {
      return;
    }
    const { id, trackId, artworkUrl } = currentGameHighlight;
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: String(id ?? "none"),
      url: makePlayStreamUriByTrackId(String(trackId)),
      title: "?????",
      artist: "???",
      artwork: artworkUrl
    });
  };

  private onFinishPopup = () => {
    const { showPopup } = this.props.popupProps;
    const heart = this.props.authStore.user?.heart!;
    showPopup(
      <ChargeFullHeartPopup
        heart={heart}
        onChargeFullHeart={this.requestHeartRewardAD}
        onCancel={this.finish}
      />,
      true,
      this.finish
    );
  };

  private requestHeartRewardAD = () => {
    showAD(AdmobUnitID.HeartReward);
  };

  private onRewarded = async () => {
    const { updateUserReward } = this.props.authStore;
    const { showToast } = this.props.toastStore;
    const { closePopup } = this.props.popupProps;
    try {
      await rewardForWatchingAdUsingPOST(RewardType.AdMovie);
      updateUserReward();
      closePopup();
      this.onGainFullHeartPopup();
    } catch (error) {
      showToast(error.message);
    }
  };

  private onGainFullHeartPopup = () => {
    const { showPopup } = this.props.popupProps;
    const fullHeartCount =
      this.props.authStore.user?.userItemsByItemType(
        Item.ItemTypeEnum.CHARGEALLHEART
      )?.count ?? 0;
    showPopup(
      <GainFullHeartPopup heartCount={fullHeartCount} onConfirm={this.finish} />
    );
  };

  private finish = async () => {
    const { closePopup } = this.props.popupProps;
    const { componentId } = this.props;
    closePopup();
    GameResultScreen.open({
      componentId,
      gamePlayHighlights: () => this.gamePlayHighlights
    });
  };

  private exit = () => {
    const { showPopup, closePopup } = this.props.popupProps;
    showPopup(
      <ConfirmPopup
        message="정말 그만두시겠어요?"
        cancelText="취소"
        onCancel={closePopup}
        confirmText="확인"
        onConfirm={this.finish}
      />
    );
  };

  private copyAnswer = () => {
    const { currentGameHighlight } = this.gamePlayHighlights;
    const { showToast } = this.props.toastStore;
    if (currentGameHighlight === null) {
      return;
    }
    const filterTitle = (currentGameHighlight.title ?? "")
      .replace(currentGameHighlight.singer ?? "", "")
      .replace("feat", "")
      .toLowerCase()
      .trim();
    Clipboard.setString(filterTitle);
    showToast("클립보드 복사 완료");
  };

  private home = () => {
    MainScreen.open();
  };
}

export default withDisabled(GamePlayScreen);
