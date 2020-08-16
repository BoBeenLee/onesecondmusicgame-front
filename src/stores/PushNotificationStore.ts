import AsyncStorage from "@react-native-community/async-storage";
import _ from "lodash";
import { flow, types } from "mobx-state-tree";
import messaging, {
  FirebaseMessagingTypes
} from "@react-native-firebase/messaging";

import { isAndroid } from "src/utils/device";

const CHANNEL_ID = "onesecondmusicgame-channel";

enum AuthorizationStatus {
  NOT_DETERMINED = -1,
  DENIED = 0,
  AUTHORIZED = 1,
  PROVISIONAL = 2
}

const PushNotificationStore = types
  .model("PushNotification", {
    fcmToken: types.maybeNull(types.string),
    pushPermission: types.optional(types.boolean, false)
  })
  .volatile(() => {
    return {
      removeNotificationListener: _.identity
    };
  })
  .actions(self => {
    const initialize = flow(function*() {
      yield fetchFCMToken();
      yield requestPushPermission();
      initializeNotification();
    });

    const getNotificationOpen = flow(function*() {
      const notificationOpen = yield messaging().getInitialNotification();
      return notificationOpen;
    });

    const initializeNotification = () => {
      self.removeNotificationListener = messaging().setBackgroundMessageHandler(
        async message => {
          // const notifiaction: Notification = {
          //   title: message.notification?.title ?? "",
          //   body: message.notification?.body ?? "",
          //   android: {
          //     channelId: channel
          //   }
          // };
          // await notifee.displayNotification(notifiaction);
        }
      );
    };

    const fetchFCMToken = flow(function*() {
      return (self.fcmToken = yield messaging().getToken());
    });

    const requestPushPermission = flow(function*() {
      const currentStatus: AuthorizationStatus = yield messaging().hasPermission();
      const isEnabled = (status: AuthorizationStatus) =>
        [AuthorizationStatus.AUTHORIZED, AuthorizationStatus.PROVISIONAL].some(
          authStatus => authStatus === status
        );
      if (isEnabled(currentStatus)) {
        return;
      }
      const authStatus = yield messaging().requestPermission();
      return (self.pushPermission = isEnabled(authStatus));
    });

    const beforeDestroy = () => {
      self.removeNotificationListener();
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
