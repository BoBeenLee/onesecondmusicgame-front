import _ from "lodash";
import * as config from "../../config.json";

interface IEnvironment {
  production: IEnvironmentEntry;
  development: IEnvironmentEntry;
  staging: IEnvironmentEntry;
  storybook: IEnvironmentEntry;
}

interface IEnvironmentEntry {
  REACT_ENV: string;
  API_URL: string;
  SOUNDCLOUD_API_URL: string;
}

const REACT_ENV = _.defaultTo(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (config as any).REACT_ENV,
  "staging"
) as keyof IEnvironment;

const SOUNDCLOUD_API_URL = "https://api.soundcloud.com";

const env: IEnvironment = {
  development: {
    REACT_ENV,
    API_URL: "http://localhost:8888",
    SOUNDCLOUD_API_URL
  },
  production: {
    REACT_ENV,
    API_URL: "http://api.alsongdalsong.com:8888",
    SOUNDCLOUD_API_URL
  },
  staging: {
    REACT_ENV,
    API_URL: "http://api.alsongdalsong.com:8888",
    SOUNDCLOUD_API_URL
  },
  storybook: {
    REACT_ENV,
    API_URL: "http://api.alsongdalsong.com:8888",
    SOUNDCLOUD_API_URL
  }
};

export const isStorybook = () => REACT_ENV === "storybook";

export const isProduction = () => REACT_ENV === "production";

export default env[REACT_ENV] || ({} as IEnvironmentEntry);
