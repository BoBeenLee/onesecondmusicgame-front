import _ from "lodash";
import { flow, types } from "mobx-state-tree";
import firebase from "react-native-firebase";
import {
  isAppShareLink,
  makeLinkPayload,
  IShareLinkPayload
} from "src/utils/dynamicLink";
import { FIELD, setItem } from "src/utils/storage";

const LinkingStore = types
  .model("LinkingStore", {
    linkingURL: types.optional(types.string, "")
  })
  .volatile(self => {
    return {
      removeLinkingListener: _.identity as any
    };
  })
  .actions(self => {
    const setLinkURL = (url: string) => {
      self.linkingURL = url;
      if (isAppShareLink(url)) {
        const linkPayload = makeLinkPayload<IShareLinkPayload>(url);
        setItem(FIELD.SHARED_ACCESS_ID, linkPayload.accessId ?? "");
      }
    };

    return {
      setLinkURL
    };
  })
  .actions(self => {
    const getInitialLink = flow(function*() {
      const url = yield firebase.links().getInitialLink();
      if (url) {
        self.setLinkURL(url);
      }
    });

    const initialize = flow(function*() {
      yield getInitialLink();
      self.removeLinkingListener = firebase.links().onLink(url => {
        if (url) {
          self.setLinkURL(url);
        }
      });
    });

    const beforeDestroy = () => {
      self.removeLinkingListener();
    };

    return {
      beforeDestroy,
      initialize
    };
  });

export type ILinkingStore = typeof LinkingStore.Type;
export default LinkingStore;
