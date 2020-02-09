import _ from "lodash";
import { flow, types } from "mobx-state-tree";
import codePush from "react-native-code-push";

import { getJSONValue } from "src/configs/remoteConfig";
import { defaultItemTo, FIELD, setItem } from "src/utils/storage";
import { getUniqueID } from "src/configs/device";

interface ICodePushData {
  codePushBuild: number;
  updateNote: string;
  deviceIds: string[];
}

const INITIAL_CODE_PUSH_DATA: ICodePushData = {
  codePushBuild: 0,
  updateNote: "",
  deviceIds: []
};

const CodePushStore = types
  .model("CodePushStore", {
    codePushKey: types.optional(types.string, FIELD.CODE_PUSH),
    currentCodePushData: types.optional(
      types.frozen<ICodePushData>(),
      INITIAL_CODE_PUSH_DATA
    ),
    isCodePush: types.optional(types.boolean, false),
    newCodePushData: types.optional(
      types.frozen<ICodePushData>(),
      INITIAL_CODE_PUSH_DATA
    )
  })
  .views(self => {
    return {
      get description() {
        return self.newCodePushData.updateNote;
      }
    };
  })
  .actions(self => {
    const initialize = flow(function*() {
      try {
        const targetDeviceID = getUniqueID();
        self.currentCodePushData = yield defaultItemTo<ICodePushData>(
          self.codePushKey,
          INITIAL_CODE_PUSH_DATA
        );
        self.newCodePushData = yield getJSONValue<ICodePushData>(
          self.codePushKey,
          INITIAL_CODE_PUSH_DATA
        );
        const { deviceIds: userIDs } = self.newCodePushData;

        if (__DEV__) {
          self.isCodePush = false;
          return;
        }
        if (
          !_.isEmpty(userIDs) &&
          _.includes(userIDs, targetDeviceID) &&
          self.currentCodePushData.codePushBuild !==
            self.newCodePushData.codePushBuild
        ) {
          self.isCodePush = true;
          return;
        }
        if (
          _.isEmpty(userIDs) &&
          self.currentCodePushData.codePushBuild !==
            self.newCodePushData.codePushBuild
        ) {
          self.isCodePush = true;
          return;
        }
        self.isCodePush = false;
      } catch (error) {
        self.isCodePush = false;
        return;
      }
    });

    const checkCodePushAvailability = flow(function*() {
      if (!self.isCodePush) {
        return false;
      }
      try {
        const update = yield codePush.checkForUpdate();
        if (update) {
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    });

    const updateCodePush = flow(function*() {
      yield updateCodePushData();
      codePush.sync({ installMode: codePush.InstallMode.IMMEDIATE });
    });

    const updateCodePushData = flow(function*() {
      self.currentCodePushData = self.newCodePushData;
      yield setItem(self.codePushKey, JSON.stringify(self.newCodePushData));
    });

    const notifyAppReady = flow(function*() {
      yield codePush.notifyAppReady();
    });

    return {
      checkCodePushAvailability,
      initialize,
      notifyAppReady,
      updateCodePush
    };
  });

export const getCodePushStore = (stores: any): ICodePushStore =>
  _.get(stores, ["store", "codePushStore"], {});

export type ICodePushStore = typeof CodePushStore.Type;
export default CodePushStore;
