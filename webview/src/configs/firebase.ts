import firebase from "firebase/app";

import "firebase/analytics";
import _ from "lodash";

import env from "./env";

export const initialize = _.once(() => {
  if (!env.FIREBASE_CONFIG) {
    return;
  }
  const firebaseConfig = env.FIREBASE_CONFIG;
  firebase.initializeApp(firebaseConfig);
});
