import { Item } from "__generate__/api";
import _ from "lodash";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
  IGamePlayHighlightItem
} from "src/stores/GamePlayHighlights";
import GamePlayTutorialOverlay from "src/screens/tutorial/GamePlayTutorialOverlay";
import XEIcon from "src/components/icon/XEIcon";
import SkipIcon from "src/components/icon/SkipIcon";
import images from "src/images";
import IconButton from "src/components/button/IconButton";
import ConfirmPopup from "src/components/popup/ConfirmPopup";

interface IInject {
  authStore: IAuthStore;
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
  heartCount: number;
}

interface IProps extends IInject, IPopupProps {
  componentId: string;
  selectedSingers: ISinger[];
  parentComponentId: string;
}

interface IStates {
  currentStepStatus: "play" | "stop" | "answer";
  songAnswerInput: string;
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
  top: 0px;
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

const Content = styled.View`
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
  public static open(params: IParams) {
    if (params.heartCount === 0) {
      throw new Error("하트가 부족합니다.");
    }
    return push({
      componentId: params.componentId,
      nextComponentId: SCREEN_IDS.GamePlayScreen,
      params: {
        selectedSingers: [],
        parentComponentId: params.componentId
      }
    });
  }

  public static openSelectedSingers(params: IParams) {
    if (params.heartCount === 0) {
      throw new Error("하트가 부족합니다.");
    }
    GameSearchSingerScreen.open({
      componentId: params.componentId,
      onResult: (selectedSingers: ISinger[]) => {
        push({
          componentId: getCurrentComponentId(),
          nextComponentId: SCREEN_IDS.GamePlayScreen,
          params: {
            selectedSingers,
            parentComponentId: params.componentId
          }
        });
      }
    });
  }

  public gamePlayersRef = React.createRef<OSMGCarousel<any>>();
  public gamePlayHighlights = GamePlayHighlights.create({});

  constructor(props: IProps) {
    super(props);
    this.state = {
      currentStepStatus: "stop",
      songAnswerInput: ""
    };
    loadAD(AdmobUnitID.HeartReward, ["game", "quiz"], {
      onRewarded: this.onRewarded
    });
    props.authStore.user?.heart?.useHeart?.();
    GamePlayTutorialOverlay.open({
      onAfterClose: () => {
        this.setState({ currentStepStatus: "answer" });
      }
    });
  }

  public componentDidMount() {
    const { selectedSingers } = this.props;
    this.gamePlayHighlights.initialize(selectedSingers);
  }

  public render() {
    const { currentStep, gamePlayStepStatuses } = this.gamePlayHighlights;
    const { currentStepStatus } = this.state;
    return (
      <Container>
        <InnerContainer enableOnAndroid={true} enableAutomaticScroll={false}>
          <Header>
            <GamePlayStep circles={gamePlayStepStatuses} />
            <LimitTimeProgress
              key={`${currentStep}`}
              pause={currentStepStatus !== "play"}
              seconds={DEFAULT_LIMIT_TIME}
              onTimeEnd={this.onLimitTimeEnd}
            />
            <GameStopButton source={images.pauseButton} onPress={this.exit} />
          </Header>
          {["play", "stop"].some(status => status === currentStepStatus)
            ? this.renderGamePlay
            : this.renderAnswer}
        </InnerContainer>
      </Container>
    );
  }

  private get renderGamePlay() {
    const { songAnswerInput } = this.state;
    const userItem = this.props.authStore.user?.userItemsByItemType(
      Item.ItemTypeEnum.SKIP
    );

    return (
      <>
        <GamePlayers
          scrollEnabled={false}
          ref={this.gamePlayersRef}
          data={this.gameHighlightViews}
          itemWidth={240}
          renderItem={this.renderItem}
          onSnapToItem={this.onSnapToItem}
        />
        <Content>
          <SongInput>
            <SongTextInput
              placeholder="노래명을 맞춰주세요!"
              placeholderTextColor={colors.blueyGrey}
              value={songAnswerInput}
              onChangeText={this.onSongAnswerChangeText}
            />
          </SongInput>
        </Content>
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
    const { checkAnswer, currentGameHighlight } = this.gamePlayHighlights;
    const { songAnswerInput } = this.state;
    const isAnswer = checkAnswer(songAnswerInput);
    return (
      <>
        <Content>
          {isAnswer ? null : <AnswerStatus source={images.correctCD} />}
          <AnswerView>
            <AnswerText>정답입니다~!!</AnswerText>
            <AnswerSingerText>
              {currentGameHighlight?.singer ?? ""}
            </AnswerSingerText>
            <AnswerSongText>{currentGameHighlight?.title ?? ""}</AnswerSongText>
          </AnswerView>
        </Content>
        <Footer>
          <NextEmptyView />
          <NextStepGroup>
            <NextStepCaption>5초 뒤 다음 문제</NextStepCaption>
            <NextStepButton>
              <NextStepButtonText>다음 문제</NextStepButtonText>
              <NextStepArrowIcon
                name="angle-right"
                size={16}
                color={colors.pinkyPurpleThree}
              />
            </NextStepButton>
          </NextStepGroup>
        </Footer>
      </>
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
      <GamePlayerView>
        <GameAudioPlayer size={200} gamePlayItem={props.item} />
      </GamePlayerView>
    );
  };

  private onSnapToItem = (index: number) => {
    this.gamePlayHighlights.setStep(index);
  };

  private onLimitTimeEnd = () => {
    this.beforeNextStep();
  };

  private useSkipItem = () => {
    const { closePopup } = this.props.popupProps;
    const userItem = this.props.authStore.user?.userItemsByItemType(
      Item.ItemTypeEnum.SKIP
    );
    userItem?.useItemType?.();
    closePopup();
    this.setState(
      {
        currentStepStatus: "play",
        songAnswerInput: ""
      },
      this.nextStep
    );
  };

  private submitAnswer = () => {
    const {
      answer,
      checkAnswer,
      currentGameHighlight
    } = this.gamePlayHighlights;
    const { songAnswerInput } = this.state;
    const { showToast } = this.props.toastStore;

    if (currentGameHighlight === null) {
      showToast("게임 플레이곡이 없습니다");
      return;
    }
    if (!checkAnswer(songAnswerInput)) {
      showToast("오답입니다ㅠㅜ");
      return;
    }
    answer(songAnswerInput);
    this.beforeNextStep();
  };

  private beforeNextStep = () => {
    this.setState({
      currentStepStatus: "answer"
    });
    setTimeout(() => {
      this.setState(
        {
          currentStepStatus: "play",
          songAnswerInput: ""
        },
        this.nextStep
      );
    }, NEXT_STEP_SECONDS);
  };

  private nextStep = () => {
    const { isFinish } = this.gamePlayHighlights;
    if (isFinish) {
      this.onFinishPopup();
      return;
    }
    this.gamePlayersRef.current?.snapToNext();
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
    try {
      await rewardForWatchingAdUsingPOST(RewardType.AdMovie);
      updateUserReward();
      showToast("보상 완료!");
    } catch (error) {
      showToast(error.message);
    } finally {
      this.finish();
    }
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
        onConfirm={this.back}
      />
    );
  };

  private back = () => {
    const { componentId, parentComponentId } = this.props;
    popTo(parentComponentId);
  };
}

export default GamePlayScreen;
