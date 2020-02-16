import _ from "lodash";
import firebase from "react-native-firebase";

import { traverseObjectKeys, traverseObjectSliceStr } from "src/utils/string";

export type EventType =
  | "sign_in"
  | "game_start"
  | "selected_singer"
  | "correct_answer"
  | "wrong_answer"
  | "click_ad";

export interface IEventResult {
  eventType: EventType;
  [key: string]: any;
}

const EVENT_TYPE_MAX_LENGTH = 40;

export function initialize() {
  firebase.analytics().setAnalyticsCollectionEnabled(true);
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
  firebase.analytics().logEvent(eventData.eventType, parameters);
}

export const logEvent = {
  signIn: (provider: "APPLE" | "KAKAO" | "GOOGLE" | "FACEBOOK" | "NONE") => {
    firebaseLogEvent({
      eventType: "sign_in",
      provider
    });
  },
  gameStart: (level: "RANDOM" | "HARD" | "NORMAL" | "EASY") => {
    firebaseLogEvent({
      eventType: "game_start",
      level
    });
  },
  selectedSinger: (singerName: string) => {
    firebaseLogEvent({
      eventType: "selected_singer",
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
  clickAD: (popupType: "SKIP" | "FULLHEART") => {
    firebaseLogEvent({
      eventType: "click_ad",
      popupType
    });
  }
};

export function firebaseSetUserId(userId: string) {
  firebase.analytics().setUserId(userId);
}

export function setUserID(userId: string) {
  firebaseSetUserId(userId);
}

export function setCurrentScreen(componentName: string) {
  firebase.analytics().setCurrentScreen(componentName);
}
