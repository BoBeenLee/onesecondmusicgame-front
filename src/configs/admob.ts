/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from "lodash";
import firebase from "react-native-firebase";

import env from "src/configs/env";

interface AdRequest {
  addKeyword: (keyword: string) => AdRequest;
  build: () => any;
}

interface IAdvert {
  loadAd: (request: any) => void;
  isLoaded: () => boolean;
  show: () => void;
  on: (event: string, callback: (event?: any) => void) => void;
}

interface IAdmobModule {
  initialize: (id: string) => void;
  interstitial: (unitId: string) => IAdvert;
  rewarded: (unitId: string) => IAdvert;
}

class AdmobUnit {
  public advert: IAdvert;

  constructor(buildAdvert: () => IAdvert) {
    this.advert = buildAdvert();
  }

  public load = (
    keywords: string[],
    onListeners?: {
      onAdLoaded?: () => void;
      onRewarded?: (event: any) => void;
    }
  ) => {
    const request: AdRequest = new (firebase as any).admob.AdRequest();

    for (const keyword of keywords) {
      request.addKeyword(keyword);
    }
    this.advert.loadAd(request.build());
    onListeners?.onAdLoaded &&
      this.advert.on("onAdLoaded", onListeners?.onAdLoaded);
    onListeners?.onRewarded &&
      this.advert.on("onRewarded", onListeners?.onRewarded);
  };

  public show = () => {
    if (this.advert.isLoaded()) {
      this.advert.show();
    }
  };
}

export enum AdmobUnitID {
  HeartReward = "HeartReward",
  HeartScreen = "HeartScreen"
}

const admobs: { [key in keyof typeof AdmobUnitID]: AdmobUnit } = {
  [AdmobUnitID.HeartReward]: new AdmobUnit(() => {
    const admobModule = (firebase as any).admob() as IAdmobModule;
    return admobModule.rewarded(env.buildAdEnv().HEART_REWARD);
  }),
  [AdmobUnitID.HeartScreen]: new AdmobUnit(() => {
    const admobModule = (firebase as any).admob() as IAdmobModule;
    return admobModule.interstitial(env.buildAdEnv().HEART_SCREEN);
  })
};

export const loadAD = (
  admobUnitID: AdmobUnitID,
  keywords: string[],
  onAdLoaded?: () => void,
  onRewarded?: (event: any) => void
) => {
  admobs[admobUnitID].load(keywords, {
    onAdLoaded,
    onRewarded
  });
};

export const showAD = (admobUnitID: AdmobUnitID) => {
  admobs[admobUnitID].show();
};

export const initialize = () => {
  const admobModule = (firebase as any).admob() as IAdmobModule;
  admobModule.initialize(env.buildAdEnv().APP_ID);
};
