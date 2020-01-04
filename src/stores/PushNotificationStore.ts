import AsyncStorage from "@react-native-community/async-storage";
import _ from "lodash";
import { flow, types } from "mobx-state-tree";
import firebase, { RNFirebase } from "react-native-firebase";

import {
  Notification,
  NotificationOpen
} from "react-native-firebase/notifications";
import { getUniqueID, isAndroid } from "src/utils/device";
import { FIELD, setItem } from "src/utils/storage";
import { defaultItemToBoolean } from "src/utils/storage";

const CHANNEL_ID = "onesecondmusicgame-channel";

const PushNotificationStore = types
  .model("PushNotification", {
    fcmToken: types.maybeNull(types.string),
    pushPermission: types.optional(types.boolean, false)
  })
  .volatile(() => {
    return {
      removeNotificationDisplayedListener: _.identity,
      removeNotificationListener: _.identity,
      removeNotificationOpendedListener: _.identity
    };
  })
  .actions(self => {
    const initialize = flow(function*() {
      yield fetchFCMToken();
      yield requestPushPermission();
      initializeNotification();
    });

    const getNotificationOpen = flow(function*() {
      const notificationOpen: RetrieveAsyncFunc<() => Promise<
        RNFirebase.notifications.NotificationOpen
      >> = yield firebase.notifications().getInitialNotification();
      return notificationOpen;
    });

    const initializeNotification = () => {
      const channel = new firebase.notifications.Android.Channel(
        CHANNEL_ID,
        "onesecondmusicgame Channel",
        firebase.notifications.Android.Importance.Max
      ).setDescription("onesecondmusicgame channel");

      // Create the channel
      firebase.notifications().android.createChannel(channel);

      self.removeNotificationOpendedListener = firebase
        .notifications()
        .onNotificationOpened((notificationOpen: NotificationOpen) => {
          const notification = notificationOpen.notification;
        });
      self.removeNotificationListener = firebase
        .notifications()
        .onNotification((notification: Notification) => {
          if (isAndroid()) {
            notification.android.setChannelId(CHANNEL_ID);
          }
          firebase.notifications().displayNotification(notification);
        });
    };

    const fetchFCMToken = flow(function*() {
      return (self.fcmToken = yield firebase.messaging().getToken());
    });

    const requestPushPermission = flow(function*() {
      const enabled = yield firebase.messaging().hasPermission();

      if (enabled) {
        return;
      }
      try {
        yield firebase.messaging().requestPermission();
        return (self.pushPermission = true);
      } catch (error) {
        return (self.pushPermission = false);
      }
    });

    const beforeDestroy = () => {
      self.removeNotificationDisplayedListener();
      self.removeNotificationListener();
      self.removeNotificationOpendedListener();
    };

    return {
      beforeDestroy,
      getNotificationOpen,
      initialize,
      initializeNotification
    };
  });

export const getPushNotificationStore = (stores: any): IPushNotificationStore =>
  _.get(stores, ["store", "pushNotificationStore"], {});

export type IPushNotificationStore = typeof PushNotificationStore.Type;
export default PushNotificationStore;
