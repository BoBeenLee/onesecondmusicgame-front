import { GamePlayHighlightDTO } from "__generate__/api";
import _ from "lodash";
import { types, flow } from "mobx-state-tree";
import { getHighlightListUsingPOST } from "src/apis/game";
import { ISinger } from "src/apis/singer";
import { ICircleCheckItem } from "src/components/icon/CircleCheckGroup";

export interface IGamePlayHighlightItem extends GamePlayHighlightDTO {
  gameStep: number;
  userAnswer?: string;
}

const GAME_ROUND_NUM = 5;

const GamePlayHighlights = types
  .model("GameHighlights", {
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
              item.title?.toLowerCase?.() ===
                item?.userAnswer?.toLowerCase?.() ||
              item?.userAnswer?.toLowerCase?.() === undefined
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
        return this.gameHighlightViews.filter(
          item =>
            item.title?.toLowerCase?.() === item?.userAnswer?.toLowerCase?.()
        );
      },
      get currentGameHighlight() {
        if (this.gameTotalRoundNum <= self.currentStep) {
          return null;
        }
        return self.gameHighlights[self.currentStep];
      },
      get isFinish() {
        return self.currentStep === this.gameTotalRoundNum - 1;
      },
      get toGameAnswers() {
        return this.gameHighlightViews.map(item => ({
          answer: item.userAnswer,
          id: item.id
        }));
      },
      checkAnswer(userAnswer: string) {
        const item = self.gameHighlights[self.currentStep];
        return item.title?.toLowerCase?.() === userAnswer.toLowerCase();
      }
    };
  })
  .actions(self => {
    const initialize = flow(function*(selectedSingers: ISinger[]) {
      const response: RetrieveAsyncFunc<typeof getHighlightListUsingPOST> = yield getHighlightListUsingPOST(
        {
          numOfHighlightPerGame: GAME_ROUND_NUM,
          singerList: _.map(selectedSingers, singer => singer.name)
        }
      );
      self.gameHighlights.replace(
        _.map(response.playHighlightList, (item, index) => {
          return { ...item, gameStep: index };
        })
      );
      self.playToken = response.playToken ?? "";
    });

    const answer = (userAnswer: string) => {
      self.gameHighlights.replace(
        _.map(self.gameHighlightViews, (item, index) => {
          if (self.currentStep === index) {
            return {
              ...item,
              userAnswer
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

    return { initialize, setStep, nextStep, answer };
  });

export type IGamePlayHighlights = typeof GamePlayHighlights.Type;

export default GamePlayHighlights;
