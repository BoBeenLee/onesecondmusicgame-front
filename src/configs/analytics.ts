// eslint-disable @typescript-eslint/camelcase
import _ from "lodash";
import rnFirebaseAnalytics from "@react-native-firebase/analytics";

import { traverseObjectKeys, traverseObjectSliceStr } from "src/utils/string";

export type EventType =
  | "sign_in"
  | "change_user_profile_image"
  | "change_user_nickname"
  | "game_start"
  | "game_end"
  | "game_restart"
  | "game_skip_item"
  | "game_wrong_pass"
  | "game_selected_singer"
  | "correct_answer"
  | "wrong_answer"
  | "register_song_highlight"
  | "register_selected_singer"
  | "click_ad";

export interface IEventResult {
  eventType: EventType;
  [key: string]: any;
}

const EVENT_TYPE_MAX_LENGTH = 40;

export function initialize() {
  // nothing
}

function firebaseLogEvent(eventData: IEventResult) {
  const { eventType } = eventData;

  if (!eventType) {
    throw new Error("eventType is not provided!");
  }

  if (eventType.length > EVENT_TYPE_MAX_LENGTH) {
    throw new Error(
      `${eventType} has over ${EVENT_TYPE_MAX_LENGTH} characters!`
    );
  }

  const isAllKeysUnderLength40 = traverseObjectKeys(
    _.omit(eventData, ["eventType"]),
    key => key.length <= EVENT_TYPE_MAX_LENGTH
  );

  if (!isAllKeysUnderLength40) {
    throw new Error(`keys has over ${EVENT_TYPE_MAX_LENGTH} characters!`);
  }

  const parameters = traverseObjectSliceStr(
    _.omit(eventData, ["eventType"]),
    100
  );
  rnFirebaseAnalytics().logEvent(eventData.eventType, parameters);
}

export const logEvent = {
  signIn: (provider: "APPLE" | "KAKAO" | "GOOGLE" | "FACEBOOK" | "NONE") => {
    firebaseLogEvent({
      eventType: "sign_in",
      provider
    });
  },
  changeUserProfileImage: () => {
    firebaseLogEvent({
      eventType: "change_user_profile_image"
    });
  },
  changeUserNickname: () => {
    firebaseLogEvent({
      eventType: "change_user_nickname"
    });
  },
  gameStart: (level: "RANDOM" | "HARD" | "NORMAL" | "EASY") => {
    firebaseLogEvent({
      eventType: "game_start",
      level
    });
  },
  gameEnd: () => {
    firebaseLogEvent({
      eventType: "game_end"
    });
  },
  gameRestart: () => {
    firebaseLogEvent({
      eventType: "game_restart"
    });
  },
  gameSkipItem: () => {
    firebaseLogEvent({
      eventType: "game_skip_item"
    });
  },
  gameWrongPass: () => {
    firebaseLogEvent({
      eventType: "game_wrong_pass"
    });
  },
  gameSelectedSinger: (singerName: string) => {
    firebaseLogEvent({
      eventType: "game_selected_singer",
      singerName
    });
  },
  correctAnswer: (trackId: number) => {
    firebaseLogEvent({
      eventType: "correct_answer",
      trackId: String(trackId)
    });
  },
  wrongAnswer: (trackId: number) => {
    firebaseLogEvent({
      eventType: "wrong_answer",
      trackId: String(trackId)
    });
  },
  registerSongHighlight: ({
    title,
    singerName
  }: {
    title: string;
    singerName: string;
  }) => {
    firebaseLogEvent({
      eventType: "register_song_highlight",
      title,
      singerName
    });
  },
  registerSelectedSinger: (singerName: string) => {
    firebaseLogEvent({
      eventType: "register_selected_singer",
      singerName
    });
  },
  clickAD: (popupType: "SKIP" | "FULLHEART") => {
    firebaseLogEvent({
      eventType: "click_ad",
      popupType
    });
  }
};

export function firebaseSetUserId(userId: string) {
  rnFirebaseAnalytics().setUserId(userId);
}

export function setUserID(userId: string) {
  firebaseSetUserId(userId);
}

export function setCurrentScreen(componentName: string) {
  rnFirebaseAnalytics().logScreenView({
    screen_name: componentName,
    screen_class: componentName
  });
}
