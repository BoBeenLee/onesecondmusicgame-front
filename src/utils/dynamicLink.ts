import firebase from "react-native-firebase";

const ONESECONDMUSICGAME_PREFIX_URL = "https://onesecondmusicgame.kr";

export const makeAppShareLink = async (accessId: string) => {
  const link = new firebase.links.DynamicLink(
    `${ONESECONDMUSICGAME_PREFIX_URL}?accessId=${accessId}`,
    "onesecondmusicgame.page.link"
  ).android
    .setPackageName("kr.nexters.onesecondmusicgame")
    .ios.setBundleId("kr.nexters.onesecondmusicgame");
  return await firebase.links().createShortDynamicLink(link, "SHORT");
};
