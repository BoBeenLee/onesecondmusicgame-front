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
    ? "ca-app-pub-7927704382463131~8110014374"
    : "ca-app-pub-7927704382463131~1736177714",
  HEART_REWARD: "ca-app-pub-3940256099942544/5224354917",
  HEART_SCREEN: "ca-app-pub-3940256099942544/8691691433"
});

const buildProdAdEnv = () => ({
  APP_ID: isIOS()
    ? "ca-app-pub-7927704382463131~8110014374"
    : "ca-app-pub-7927704382463131~1736177714",
  HEART_REWARD: isIOS()
    ? "ca-app-pub-7927704382463131/3882569726"
    : "ca-app-pub-7927704382463131/2829891243",
  HEART_SCREEN: isIOS()
    ? "ca-app-pub-7927704382463131/4738703438"
    : "ca-app-pub-7927704382463131/2662655698"
});

const STAGING_ENV_ENTRY: IEnvironmentEntry = {
  REACT_ENV,
  API_URL: "http://api.alsongdalsong.com:8888",
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
    API_URL: "http://api.alsongdalsong.com:8888",
    WEBVIEW_URL: "http://onesecondmusicgame.surge.sh",
    SOUNDCLOUD_API_URL,
    buildAdEnv: buildTestAdEnv
  },
  staging: STAGING_ENV_ENTRY,
  storybook: STAGING_ENV_ENTRY
};

export const isStorybook = () => REACT_ENV === "storybook";

export const isProduction = () => REACT_ENV === "production";

export default env[REACT_ENV] || ({} as IEnvironmentEntry);
