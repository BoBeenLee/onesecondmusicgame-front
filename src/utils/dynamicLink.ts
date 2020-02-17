import _ from "lodash";
import qs from "qs";
import URL from "url";
import firebase from "react-native-firebase";

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
  const link = new firebase.links.DynamicLink(
    `${ONESECONDMUSICGAME_PREFIX_URL}${LinkType.SHARE}?accessId=${accessId}`,
    DOMAIN_URI_PREFIX
  ).android
    .setPackageName("kr.nexters.onesecondmusicgame")
    .ios.setAppStoreId("1493107650")
    .ios.setBundleId("kr.nexters.onesecondmusicgame")
    .ios.setIPadBundleId("kr.nexters.onesecondmusicgame")
    .ios.setCustomScheme(CUSTOM_PROTOCOL)
    .social.setTitle("알쏭달쏭")
    .social.setDescriptionText("1초 노래 듣고 노래 제목 맞추는 게임, 알쏭달쏭?")
    .social.setImageUrl(appImageURL)
    .navigation.setForcedRedirectEnabled(true);
  return await firebase.links().createShortDynamicLink(link, "SHORT");
};
