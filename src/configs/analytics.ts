import _ from "lodash";
import firebase from "react-native-firebase";

import { traverseObjectKeys, traverseObjectSliceStr } from "src/utils/string";

export type EventType = "login";

export interface IEventResult {
  eventType: EventType;
  [key: string]: any;
}

const EVENT_TYPE_MAX_LENGTH = 40;

export function initialize() {
  firebase.analytics().setAnalyticsCollectionEnabled(true);
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

export function logEvent(eventData: IEventResult) {
  firebaseLogEvent(eventData);
}

export function firebaseSetUserId(userId: string) {
  firebase.analytics().setUserId(userId);
}

export function setUserID(userId: string) {
  firebaseSetUserId(userId);
}

export function setCurrentScreen(componentName: string) {
  firebase.analytics().setCurrentScreen(componentName);
}
