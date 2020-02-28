import _ from "lodash";
import { Linking, PlatformOSType } from "react-native";
import { types, flow } from "mobx-state-tree";
import { isNeedForceUpdateUsingGET } from "src/apis/versioning";

const AppStore = types
  .model("AppStore", {
    os: types.frozen<PlatformOSType>(),
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
        if (self.os === "android") {
          yield Linking.openURL(
            "https://play.google.com/store/apps/details?id=kr.nexters.onesecondmusicgame"
          );
          return;
        }
        yield Linking.openURL("https://apps.apple.com/app/id1493107650");
      } catch (error) {
        throw new Error("스토어에서 업데이트가 필요합니다.");
      }
    });

    return {
      fetchIsNeedForceUpdate,
      openAppStore
    };
  });

export type IAppStore = typeof AppStore.Type;

export default AppStore;
