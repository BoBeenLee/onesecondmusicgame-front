import _ from "lodash";
import * as config from "../../config.json";
import { isIOS } from "src/utils/device";

interface IEnvironment {
  production: IEnvironmentEntry;
  development: IEnvironmentEntry;
  staging: IEnvironmentEntry;
  storybook: IEnvironmentEntry;
}

interface IAdmobEnv {
  APP_ID: string;
  GAME_RESULT: string;
  HEART_REWARD: string;
  HEART_SCREEN: string;
}

interface IEnvironmentEntry {
  REACT_ENV: string;
  API_URL: string;
  WEBVIEW_URL: string;
  SOUNDCLOUD_API_URL: string;
  buildAdEnv: () => IAdmobEnv;
}

const REACT_ENV = _.defaultTo(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (config as any).REACT_ENV,
  "staging"
) as keyof IEnvironment;

const SOUNDCLOUD_API_URL = "https://api.soundcloud.com";

const buildTestAdEnv = () => ({
  APP_ID: isIOS()
    ? "ca-app-pub-8725491575270284~8101981332"
    : "ca-app-pub-8725491575270284~4676713978",
  HEART_REWARD: "ca-app-pub-3940256099942544/5224354917",
  HEART_SCREEN: "ca-app-pub-3940256099942544/8691691433",
  GAME_RESULT: "ca-app-pub-3940256099942544/6300978111"
});

const buildProdAdEnv = () => ({
  APP_ID: isIOS()
    ? "ca-app-pub-8725491575270284~8101981332"
    : "ca-app-pub-8725491575270284~4676713978",
  HEART_REWARD: isIOS()
    ? "ca-app-pub-8725491575270284/9747424862"
    : "ca-app-pub-8725491575270284/6929689833",
  HEART_SCREEN: isIOS()
    ? "ca-app-pub-8725491575270284/3439653928"
    : "ca-app-pub-8725491575270284/8691980606",
  GAME_RESULT: isIOS()
    ? "ca-app-pub-8725491575270284/6361609978"
    : "ca-app-pub-8725491575270284/2748849786"
});

const STAGING_ENV_ENTRY: IEnvironmentEntry = {
  REACT_ENV,
  API_URL: "http://api-dev.alsongdalsong.com",
  WEBVIEW_URL: "http://onesecondmusicgame.surge.sh",
  SOUNDCLOUD_API_URL,
  buildAdEnv: buildTestAdEnv
};

const env: IEnvironment = {
  development: {
    ...STAGING_ENV_ENTRY,
    REACT_ENV,
    API_URL: "http://localhost:8080",
    WEBVIEW_URL: "http://localhost:8000"
  },
  production: {
    REACT_ENV,
    API_URL: "http://api.alsongdalsong.com",
    WEBVIEW_URL: "http://onesecondmusicgame.surge.sh",
    SOUNDCLOUD_API_URL,
    buildAdEnv: buildProdAdEnv
  },
  staging: STAGING_ENV_ENTRY,
  storybook: STAGING_ENV_ENTRY
};

export const isStorybook = () => REACT_ENV === "storybook";

export const isProduction = () => REACT_ENV === "production";

export default env[REACT_ENV] || ({} as IEnvironmentEntry);
