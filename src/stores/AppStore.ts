import _ from "lodash";
import { Linking } from "react-native";
import { types, flow } from "mobx-state-tree";
import { isNeedForceUpdateUsingGET } from "src/apis/versioning";

const AppStore = types
  .model("AppStore", {
    os: types.string,
    version: types.string,
    isUpdate: types.optional(types.boolean, false)
  })
  .actions(self => {
    const fetchIsNeedForceUpdate = flow(function*() {
      self.isUpdate = yield isNeedForceUpdateUsingGET({
        os: self.os,
        version: self.version
      });
    });
    const openAppStore = flow(function*() {
      try {
        yield Linking.openURL("google store app store");
      } catch (error) {
        throw new Error("스토어에서 업데이트가 필요합니다.")
      }
    });

    return {
      fetchIsNeedForceUpdate,
      openAppStore
    };
  });

export type IAppStore = typeof AppStore.Type;

export default AppStore;
