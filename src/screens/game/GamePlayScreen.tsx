import { Item } from "__generate__/api";
import _ from "lodash";
import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components/native";

import ContainerWithStatusBar from "src/components/ContainerWithStatusBar";
import { Bold12, Bold20 } from "src/components/text/Typographies";
import { SCREEN_IDS } from "src/screens/constant";
import { push, pop } from "src/utils/navigator";
import CircleCheckGroup from "src/components/icon/CircleCheckGroup";
import LimitTimeProgress from "src/components/progress/LimitTimeProgress";
import colors from "src/styles/colors";
import OSMGCarousel, { ICarousel } from "src/components/carousel/OSMGCarousel";
import GameAudioPlayer from "src/components/player/GameAudioPlayer";
import OSMGTextInput from "src/components/input/OSMGTextInput";
import MockButton from "src/components/button/MockButton";
import { IPopupProps } from "src/hocs/withPopup";
import OnlyConfirmPopup from "src/components/popup/OnlyConfirmPopup";
import { IAuthStore } from "src/stores/AuthStore";
import { IToastStore } from "src/stores/ToastStore";
import { IStore } from "src/stores/Store";
import GameResultScreen from "src/screens/game/GameResultScreen";
import GameSearchSingerScreen from "src/screens/game/GameSearchSingerScreen";
import { ISinger } from "src/apis/singer";

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
  currentStep: number;
  currentStepStatus: "play" | "answer";
  songAnswerInput: string;
  songAnswers: string[];
}

interface ICarouselItem extends ICarousel {
  source: { uri: string };
}

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

const PopupContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const PopupTitle = styled(Bold20)`
  margin-top: 33px;
  margin-bottom: 33px;
`;

const PopupDescription = styled(Bold12)`
  margin-bottom: 47px;
`;

const MOCK_PLAYER_DATA: ICarouselItem[] = [
  {
    key: "1",
    source: {
      uri: "https://picsum.photos/200/300/?random"
    }
  },
  {
    key: "2",
    source: {
      uri: "https://picsum.photos/200/300/?random"
    }
  },
  {
    key: "3",
    source: {
      uri: "https://picsum.photos/200/300/?random"
    }
  }
];

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
          componentId: params.componentId,
          nextComponentId: SCREEN_IDS.GamePlayScreen,
          params: {
            selectedSingers
          }
        });
      }
    });
  }

  public gamePlayersRef = React.createRef<OSMGCarousel<any>>();

  constructor(props: IProps) {
    super(props);
    this.state = {
      currentStep: 0,
      currentStepStatus: "play",
      songAnswerInput: "",
      songAnswers: []
    };
  }

  public render() {
    const userItem = this.props.authStore.user?.userItemsByItemType(
      Item.ItemTypeEnum.SKIP
    );
    const { currentStep, songAnswerInput } = this.state;
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
          data={MOCK_PLAYER_DATA}
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
            name={`스킵(${userItem?.count ?? 0})`}
            onPress={this.onSkipItemPopup}
          />
        </GameItems>
      </Container>
    );
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

  private renderItem = ({ item }: { item: any; index: number }) => {
    return (
      <GamePlayerView>
        <GameAudioPlayer
          size={200}
          source={{
            uri:
              "https://api.soundcloud.com/tracks/736765723/stream?client_id=a281614d7f34dc30b665dfcaa3ed7505"
          }}
        />
      </GamePlayerView>
    );
  };

  private onSnapToItem = (index: number) => {
    this.setState({ currentStep: index });
  };

  private onLimitTimeEnd = () => {
    this.gamePlayersRef.current?.snapToNext?.();
  };

  private onSkipItemPopup = () => {
    const { showPopup, closePopup } = this.props.popupProps;
    showPopup(
      <OnlyConfirmPopup
        ContentComponent={
          <PopupContainer>
            <PopupTitle>스킵 아이템</PopupTitle>
            <PopupDescription>{`게임 중 모르는 노래를 skip하고
정답 처리받을 수 있어요!`}</PopupDescription>
          </PopupContainer>
        }
        confirmText={"친구초대하고 아이템받기 >"}
        onConfirm={this.useSkipItem}
        onCancel={closePopup}
      />
    );
  };

  private useSkipItem = () => {
    const userItem = this.props.authStore.user?.userItemsByItemType(
      Item.ItemTypeEnum.SKIP
    );
    userItem?.useItemType?.();
  };

  private onFinishPopup = () => {
    const { showPopup, closePopup } = this.props.popupProps;
    showPopup(
      <OnlyConfirmPopup
        ContentComponent={
          <PopupContainer>
            <PopupDescription>{`하트를 모두 사용했네요!
광고를 보고
하트 Full 충전 받으시겠어요?`}</PopupDescription>
          </PopupContainer>
        }
        confirmText={"광고보기"}
        onConfirm={this.finish}
        onCancel={closePopup}
      />
    );
  };

  private submitAnswer = () => {
    this.setState(prevState => {
      return {
        currentStepStatus: "answer",
        songAnswers: [...prevState.songAnswers, prevState.songAnswerInput]
      };
    });
    setTimeout(() => {
      this.setState(
        {
          currentStepStatus: "play",
          songAnswerInput: ""
        },
        this.gamePlayersRef.current?.snapToNext
      );
    }, 2000);
  };

  private finish = () => {
    const { componentId } = this.props;
    GameResultScreen.open({ componentId });
  };
}

export default GamePlayScreen;
