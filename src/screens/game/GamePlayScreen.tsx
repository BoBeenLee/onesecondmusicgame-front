import { Item } from "__generate__/api";
import _ from "lodash";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold20 } from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { push, pop, getCurrentComponentId } from "src/utils/navigator";
import CircleCheckGroup from "src/components/icon/CircleCheckGroup";
import LimitTimeProgress from "src/components/progress/LimitTimeProgress";
import colors from "src/styles/colors";
import OSMGCarousel, { ICarousel } from "src/components/carousel/OSMGCarousel";
import GameAudioPlayer from "src/components/player/GameAudioPlayer";
import OSMGTextInput from "src/components/input/OSMGTextInput";
import MockButton from "src/components/button/MockButton";
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
import { makePlayStreamUriByTrackId } from "src/configs/soundCloudAPI";

interface IInject {
  authStore: IAuthStore;
  toastStore: IToastStore;
}

interface IParams {
  componentId: string;
}

interface IProps extends IInject, IPopupProps {
  componentId: string;
  selectedSingers: ISinger[];
}

interface IStates {
  currentStepStatus: "play" | "answer";
  songAnswerInput: string;
}

interface ICarouselItem extends ICarousel, IGamePlayHighlightItem {}

const Container = styled(ContainerWithStatusBar)`
  flex: 1;
  flex-direction: column;
`;

const Header = styled.View`
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-horizontal: 16px;
`;

const Lifes = styled(CircleCheckGroup)`
  margin-bottom: 21px;
`;

const GamePlayers = styled(OSMGCarousel)``;

const GamePlayerView = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: #eee;
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
  border-bottom-width: 1px;
  border-bottom-color: ${"#000"};
`;

const SongTextInput = styled(OSMGTextInput)``;

const AnswerView = styled.View`
  flex: 1;
  align-items: center;
  padding-top: 60px;
`;

const AnswerText = styled(Bold12)``;

const GameItems = styled.View`
  position: absolute;
  bottom: 30px;
  right: 20px;
`;

const DEFAULT_LIMIT_TIME = 40;

@inject(
  ({ store }: { store: IStore }): IInject => ({
    authStore: store.authStore,
    toastStore: store.toastStore
  })
)
@observer
class GamePlayScreen extends Component<IProps, IStates> {
  public static open(params: IParams) {
    return push({
      componentId: params.componentId,
      nextComponentId: SCREEN_IDS.GamePlayScreen,
      params: {
        selectedSingers: []
      }
    });
  }

  public static openSelectedSingers(params: IParams) {
    GameSearchSingerScreen.open({
      componentId: params.componentId,
      onResult: (selectedSingers: ISinger[]) => {
        push({
          componentId: getCurrentComponentId(),
          nextComponentId: SCREEN_IDS.GamePlayScreen,
          params: {
            selectedSingers
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
      currentStepStatus: "play",
      songAnswerInput: ""
    };
    loadAD(AdmobUnitID.HeartReward, ["game", "quiz"], {
      onRewarded: this.onRewarded
    });
    props.authStore.user?.heart?.useHeart?.();
  }

  public componentDidMount() {
    const { selectedSingers } = this.props;
    this.gamePlayHighlights.initialize(selectedSingers);
  }

  public render() {
    const userItem = this.props.authStore.user?.userItemsByItemType(
      Item.ItemTypeEnum.SKIP
    );
    const { currentStep } = this.gamePlayHighlights;
    const { songAnswerInput } = this.state;
    return (
      <Container>
        <Header>
          <Lifes circles={["active", "inactive", "check"]} />
          <LimitTimeProgress
            key={`${currentStep}`}
            seconds={DEFAULT_LIMIT_TIME}
            onTimeEnd={this.onLimitTimeEnd}
          />
        </Header>
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
              placeholder="노래 명"
              value={songAnswerInput}
              onChangeText={this.onSongAnswerChangeText}
            />
          </SongInput>
          {this.renderAnswer}
        </Content>
        <GameItems>
          <MockButton
            disabled={(userItem?.count ?? 0) === 0}
            name={`스킵(${userItem?.count ?? 0})`}
            onPress={this.useSkipItem}
          />
        </GameItems>
      </Container>
    );
  }

  private get gameHighlightViews(): ICarouselItem[] {
    return _.map(this.gamePlayHighlights.gameHighlightViews, item => ({
      ...item,
      key: String(item.id)
    }));
  }

  private get renderAnswer() {
    const { currentStepStatus } = this.state;
    return (
      <AnswerView>
        {currentStepStatus === "play" ? (
          <MockButton name="확인" onPress={this.submitAnswer} />
        ) : (
          <AnswerText>정답입니다~</AnswerText>
        )}
      </AnswerView>
    );
  }

  private onSongAnswerChangeText = (text: string) => {
    this.setState({ songAnswerInput: text });
  };

  private renderItem = (props: { item: ICarouselItem; index: number }) => {
    const { millisecond, trackId } = props.item;
    return (
      <GamePlayerView>
        <GameAudioPlayer
          highlightSeconds={_.round((millisecond ?? 0) / 1000)}
          size={200}
          source={{ uri: makePlayStreamUriByTrackId(String(trackId)) }}
        />
      </GamePlayerView>
    );
  };

  private onSnapToItem = (index: number) => {
    this.gamePlayHighlights.setStep(index);
  };

  private onLimitTimeEnd = () => {
    this.gamePlayersRef.current?.snapToNext?.();
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
    const { answer, checkAnswer } = this.gamePlayHighlights;
    const { songAnswerInput } = this.state;
    const { showToast } = this.props.toastStore;

    if (!checkAnswer(songAnswerInput)) {
      showToast("오답입니다ㅠㅜ");
      return;
    }
    this.setState({
      currentStepStatus: "answer"
    });
    answer(songAnswerInput);
    setTimeout(() => {
      this.setState(
        {
          currentStepStatus: "play",
          songAnswerInput: ""
        },
        this.nextStep
      );
    }, 2000);
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
    showPopup(
      <ChargeFullHeartPopup
        onConfirm={this.requestHeartRewardAD}
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
    const { updateUserInfo } = this.props.authStore;
    const { showToast } = this.props.toastStore;
    try {
      await rewardForWatchingAdUsingPOST(RewardType.AdMovie);
      await updateUserInfo();
      showToast("보상 완료!");
    } catch (error) {
      showToast(error.message);
    } finally {
      this.finish();
    }
  };

  private finish = () => {
    const { closePopup } = this.props.popupProps;
    const { componentId } = this.props;
    closePopup();
    GameResultScreen.open({ componentId });
  };
}

export default GamePlayScreen;
