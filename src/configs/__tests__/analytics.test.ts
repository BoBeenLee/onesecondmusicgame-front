/* eslint-disable @typescript-eslint/camelcase */
import { EventType } from "../analytics";

// tslint:disable:object-literal-sort-keys
const events: { [key in EventType]: EventType } = {
  sign_in: "sign_in",
  game_start: "game_start",
  selected_singer: "selected_singer",
  correct_answer: "correct_answer",
  wrong_answer: "wrong_answer",
  click_ad: "click_ad"
};

const eventsArray = Object.values(events);

describe("analytics", () => {
  it("validate event name length under 40", () => {
    eventsArray.map(event => {
      expect(event.length).toBeLessThanOrEqual(40);
    });
  });
});
