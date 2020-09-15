import { GamePlayHighlightDTO } from "__generate__/api";
import _ from "lodash";
import { types, flow } from "mobx-state-tree";
import { getHighlightListUsingPOST, isAnswerUsingPOST } from "src/apis/game";
import { ISinger } from "src/apis/singer";
import { ICircleCheckItem } from "src/components/icon/CircleCheckGroup";
import { getPlayStreamUri } from "src/apis/soundcloud/playStream";

export interface IGamePlayHighlightItem extends GamePlayHighlightDTO {
  streamUri: string;
  gameStep: number;
  isUserAnswer?: boolean;
  userAnswer?: string;
  userAnswerSeconds?: number;
}

const GAME_ROUND_NUM = 5;

const GamePlayHighlights = types
  .model("GameHighlights", {
    selectedSingers: types.frozen<ISinger[]>([]),
    currentStep: types.optional(types.number, 0),
    gameHighlights: types.optional(
      types.array(types.frozen<IGamePlayHighlightItem>()),
      []
    ),
    playToken: types.optional(types.string, "")
  })
  .views(self => {
    return {
      get gamePlayStepStatuses(): ICircleCheckItem[] {
        return self.gameHighlights.map((item, index) => {
          if (self.currentStep < index) {
            return {
              check: "o",
              active: false
            };
          }
          return {
            check:
              Boolean(item.isUserAnswer) || item?.isUserAnswer === undefined
                ? "o"
                : "x",
            active: self.currentStep === index
          };
        });
      },
      get gamePlayStepResultStatuses(): ICircleCheckItem[] {
        return self.gameHighlights.map((item, index) => {
          if (self.currentStep < index) {
            return {
              check: "x",
              active: false
            };
          }
          return {
            check:
              Boolean(item.isUserAnswer) || item?.isUserAnswer === undefined
                ? "o"
                : "x",
            active: self.currentStep === index
          };
        });
      },
      get gameTotalRoundNum() {
        return self.gameHighlights.length;
      },
      get gameHighlightViews() {
        return Array.from(self.gameHighlights);
      },
      get oGameHightlightViews() {
        return this.gameHighlightViews.filter(item =>
          Boolean(item.isUserAnswer)
        );
      },
      get currentGameHighlight() {
        if (this.gameTotalRoundNum <= self.currentStep) {
          return null;
        }
        return self.gameHighlights[self.currentStep];
      },
      get isFinish() {
        return self.currentStep >= this.gameTotalRoundNum - 1;
      },
      get toGameAnswers() {
        return this.gameHighlightViews.map(item => ({
          answer: item.userAnswer,
          id: item.id
        }));
      },
      checkAnswer(userAnswer: string) {
        if (self.gameHighlights.length <= self.currentStep) {
          return false;
        }
        const item = self.gameHighlights[self.currentStep];
        const filterTitle = (item?.title ?? "")
          .replace(item?.singer ?? "", "")
          .replace("feat", "")
          .toLowerCase()
          .trim();
        // /[^(가-힣ㄱ-ㅎㅏ-ㅣa-z0-9_\-)]{3,19}/gi.test(filterTitle);
        return filterTitle === userAnswer.toLowerCase();
      }
    };
  })
  .actions(self => {
    const initialize = flow(function*(selectedSingers: ISinger[]) {
      const response: RetrieveAsyncFunc<typeof getHighlightListUsingPOST> = yield getHighlightListUsingPOST(
        {
          numOfHighlightPerGame: GAME_ROUND_NUM,
          singerList: _.map(selectedSingers, singer => singer.singerName)
        }
      );

      const result: IGamePlayHighlightItem[] = [];
      for (
        let index = 0;
        index < (response.playHighlightList ?? []).length ?? 0;
        index++
      ) {
        const item = response?.playHighlightList?.[index];
        if (!item) {
          continue;
        }
        const streamUri = yield getPlayStreamUri(item.progressiveUrl ?? "");
        result.push({
          ...item,
          streamUri,
          gameStep: index
        });
      }
      self.gameHighlights.replace(result);
      self.playToken = response.playToken ?? "";
      self.selectedSingers = selectedSingers;
    });

    const isAnswer = flow(function*(userAnswer: string) {
      const response: RetrieveAsyncFunc<typeof isAnswerUsingPOST> = yield isAnswerUsingPOST(
        {
          answer: userAnswer,
          playToken: self.playToken,
          trackId: self.currentGameHighlight?.trackId ?? 0
        }
      );
      return response;
    });

    const answer = (
      isUserAnswer: boolean,
      userAnswer: string,
      userAnswerSeconds: number
    ) => {
      self.gameHighlights.replace(
        _.map(self.gameHighlightViews, (item, index) => {
          if (self.currentStep === index) {
            return {
              ...item,
              isUserAnswer,
              userAnswer,
              userAnswerSeconds
            };
          }
          return item;
        })
      );
    };

    const setStep = (step: number) => {
      self.currentStep = step;
    };

    const nextStep = () => {
      if (self.currentStep >= self.gameTotalRoundNum) {
        return;
      }
      self.currentStep += 1;
    };

    return { initialize, setStep, nextStep, answer, isAnswer };
  });

export const makeGamePlayHighlights = async (selectedSingers: ISinger[]) => {
  const gamePlayHighlights = GamePlayHighlights.create({});
  await gamePlayHighlights.initialize(selectedSingers);
  return gamePlayHighlights;
};

export type IGamePlayHighlights = typeof GamePlayHighlights.Type;

export default GamePlayHighlights;
