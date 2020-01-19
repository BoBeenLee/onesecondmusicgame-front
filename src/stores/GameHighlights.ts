import { HighlightDTO } from "__generate__/api";
import _ from "lodash";
import { types, flow } from "mobx-state-tree";
import { getHighlightListUsingGET } from "src/apis/game";
import { ISinger } from "src/apis/singer";

export interface IGameHighlightItem extends HighlightDTO {
  gameStep: number;
  userAnswer?: string;
}

const GAME_ROUND_NUM = 5;

const GameHighlights = types
  .model("GameHighlights", {
    currentStep: types.optional(types.number, 0),
    gameHighlights: types.optional(
      types.array(types.frozen<IGameHighlightItem>()),
      []
    )
  })
  .views(self => {
    return {
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
      checkAnswer(userAnswer: string) {
        const item = self.gameHighlights[self.currentStep];
        return item.title?.toLowerCase?.() === userAnswer.toLowerCase();
      }
    };
  })
  .actions(self => {
    const initialize = flow(function*(selectedSingers: ISinger[]) {
      const response: RetrieveAsyncFunc<typeof getHighlightListUsingGET> = yield getHighlightListUsingGET(
        {
          numOfHighlightPerGame: GAME_ROUND_NUM,
          singerList: _.map(selectedSingers, singer => singer.name)
        }
      );
      self.gameHighlights.replace(
        _.map(response, (item, index) => {
          return { ...item, gameStep: index };
        })
      );
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

export type IGameHighlights = typeof GameHighlights.Type;

export default GameHighlights;
