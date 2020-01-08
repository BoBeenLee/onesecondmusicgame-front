import _ from "lodash";
import qs from "qs";
import URL from "url";
import firebase from "react-native-firebase";

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
    .ios.setBundleId("kr.nexters.onesecondmusicgame")
    .ios.setCustomScheme(CUSTOM_PROTOCOL);
  return await firebase.links().createShortDynamicLink(link, "SHORT");
};
