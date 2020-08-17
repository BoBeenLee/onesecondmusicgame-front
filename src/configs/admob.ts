/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from "lodash";
import admob, {
  RewardedAd,
  InterstitialAd,
  MaxAdContentRating,
  FirebaseAdMobTypes,
  AdEventType,
  RewardedAdEventType
} from "@react-native-firebase/admob";

import env from "src/configs/env";

export class AdmobUnit {
  public advert: FirebaseAdMobTypes.MobileAd;

  constructor(advert: FirebaseAdMobTypes.MobileAd) {
    this.advert = advert;
  }

  public load = (onListeners?: {
    onAdLoaded?: () => void;
    onAdOpened?: () => void;
    onAdClosed?: () => void;
    onRewarded?: (event: FirebaseAdMobTypes.RewardedAdReward) => void;
  }) => {
    this.advert.load();
    this.advert.onAdEvent((type, error, data) => {
      switch (type) {
        case AdEventType.LOADED:
          onListeners?.onAdLoaded?.();
          break;
        case AdEventType.OPENED:
          onListeners?.onAdOpened?.();
          break;
        case AdEventType.CLOSED:
          onListeners?.onAdClosed?.();
          break;
        case RewardedAdEventType.EARNED_REWARD:
          onListeners?.onRewarded?.(data);
      }
    });
  };

  public show = () => {
    if (this.advert.loaded) {
      this.advert.show();
    }
  };
  public isLoaded = () => {
    return this.advert.loaded;
  };
}

export enum AdmobUnitID {
  HeartReward = "HeartReward",
  HeartScreen = "HeartScreen"
}

const admobs: {
  [key in AdmobUnitID]: (keywords: string[]) => AdmobUnit;
} = {
  [AdmobUnitID.HeartReward]: (keywords: string[]) => {
    const request = RewardedAd.createForAdRequest(
      env.buildAdEnv().HEART_REWARD,
      {
        keywords: Array.from(keywords)
      }
    );
    return new AdmobUnit(request);
  },
  [AdmobUnitID.HeartScreen]: (keywords: string[]) => {
    const request = InterstitialAd.createForAdRequest(
      env.buildAdEnv().HEART_SCREEN,
      {
        keywords: Array.from(keywords)
      }
    );
    return new AdmobUnit(request);
  }
};

export const loadAD = (
  admobUnitID: AdmobUnitID,
  keywords: string[],
  onListeners?: {
    onAdLoaded?: () => void;
    onAdOpened?: () => void;
    onAdClosed?: () => void;
    onRewarded?: (event: any) => void;
  }
): AdmobUnit => {
  const request = admobs[admobUnitID](keywords);
  request.load(onListeners);
  return request;
};

export const initialize = async () => {
  await admob().setRequestConfiguration({
    // Update all future requests suitable for parental guidance
    maxAdContentRating: MaxAdContentRating.PG,

    // Indicates that you want your content treated as child-directed for purposes of COPPA.
    tagForChildDirectedTreatment: true,

    // Indicates that you want the ad request to be handled in a
    // manner suitable for users under the age of consent.
    tagForUnderAgeOfConsent: true
  });
};
