import _ from "lodash";
import qs from "qs";
import URL from "url";
import dynamicLinks from "@react-native-firebase/dynamic-links";

const appImageURL =
  "https://firebasestorage.googleapis.com/v0/b/onesecondmusicgame-prod.appspot.com/o/appicon.png?alt=media&token=6f310108-7ffb-4e36-a1ee-a051ee448996";

export enum LinkType {
  SHARE = "/share"
}

export interface IShareLinkPayload {
  accessId?: string;
}

const CUSTOM_PROTOCOL = "onesecondmusicgame";
const ONESECONDMUSICGAME_PREFIX_URL = "https://onesecondmusicgame.kr";
const DOMAIN_URI_PREFIX = "https://onesecondmusicgame.page.link";

export const isAppShareLink = (paramURL: string) => {
  const url = URL.parse(paramURL);
  const { pathname } = url;
  return pathname === LinkType.SHARE;
};

export const makeLinkPayload = <T>(paramURL: string): T => {
  const url = URL.parse(paramURL);
  return qs.parse(_.defaultTo(url.query, ""));
};

export const makeAppShareLink = async (accessId: string) => {
  return await dynamicLinks().buildShortLink({
    link: `${ONESECONDMUSICGAME_PREFIX_URL}${LinkType.SHARE}?accessId=${accessId}`,
    domainUriPrefix: DOMAIN_URI_PREFIX,
    android: {
      packageName: "kr.nexters.onesecondmusicgame"
    },
    ios: {
      appStoreId: "1493107650",
      bundleId: "kr.nexters.onesecondmusicgame",
      iPadBundleId: "kr.nexters.onesecondmusicgame",
      customScheme: CUSTOM_PROTOCOL
    },
    navigation: {
      forcedRedirectEnabled: true
    },
    social: {
      title: "알쏭달쏭",
      descriptionText: "1초 노래 듣고 노래 제목 맞추는 게임, 알쏭달쏭?",
      imageUrl: appImageURL
    }
  });
};
