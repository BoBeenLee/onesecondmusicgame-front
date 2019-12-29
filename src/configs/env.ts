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
  WEBVIEW_URL: string;
}

const REACT_ENV = _.defaultTo(
  (config as any).REACT_ENV,
  "staging"
) as keyof IEnvironment;

// tslint:disable:object-literal-sort-keys
const env: IEnvironment = {
  development: {
    REACT_ENV,
    WEBVIEW_URL: "http://localhost:8000/"
  },
  production: {
    REACT_ENV,
    WEBVIEW_URL: "http://localhost:8000/"
  },
  staging: {
    REACT_ENV,
    WEBVIEW_URL: "http://localhost:8000/"
  },
  storybook: {
    REACT_ENV,
    WEBVIEW_URL: "http://localhost:8000/"
  }
};

export const isStorybook = () => REACT_ENV === "storybook";

export default env[REACT_ENV] || ({} as IEnvironmentEntry);
