/* eslint-disable @typescript-eslint/camelcase */
import { EventType } from "../analytics";

// tslint:disable:object-literal-sort-keys
const events: { [key in EventType]: EventType } = {
  sign_in: "sign_in",
  change_user_profile_image: "change_user_profile_image",
  change_user_nickname: "change_user_nickname",
  game_start: "game_start",
  game_end: "game_end",
  game_restart: "game_restart",
  game_skip_item: "game_skip_item",
  game_wrong_pass: "game_wrong_pass",
  game_selected_singer: "game_selected_singer",
  correct_answer: "correct_answer",
  wrong_answer: "wrong_answer",
  click_ad: "click_ad",
  register_song_highlight: "register_song_highlight",
  register_selected_singer: "register_selected_singer"
};

const eventsArray = Object.values(events);

describe("analytics", () => {
  it("validate event name length under 40", () => {
    eventsArray.map(event => {
      expect(event.length).toBeLessThanOrEqual(40);
    });
  });
});
