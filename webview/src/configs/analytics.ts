import firebase from "firebase/app";
import _ from "lodash";

import { traverseObjectKeys, traverseObjectSliceStr } from "src/utils/string";

export type EventType = "test";

export interface IPixelEvent {
  key: string;
  data: { [$key: string]: any };
}

export const URI_MAX_LENGTH = 20;
const EVENT_TYPE_MAX_LENGTH = 40;

export interface IEventResult {
  eventType: EventType;
  [key: string]: any;
}

export function firebaseLogEvent(eventData: IEventResult) {
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
    (key: string) => key.length <= EVENT_TYPE_MAX_LENGTH
  );

  if (!isAllKeysUnderLength40) {
    return;
  }

  const parameters = traverseObjectSliceStr(
    _.omit(eventData, ["eventType"]),
    100
  );
  firebase.analytics().logEvent(eventData.eventType, parameters);
}

export function firebaseSetUserId(userId: string) {
  firebase.analytics().setUserId(userId);
}

export function setCurrentScreen(componentName: string) {
  firebase.analytics().setCurrentScreen(componentName);
}
