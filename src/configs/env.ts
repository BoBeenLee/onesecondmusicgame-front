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
}

const REACT_ENV = _.defaultTo(
  (config as any).REACT_ENV,
  "staging"
) as keyof IEnvironment;

// tslint:disable:object-literal-sort-keys
const env: IEnvironment = {
  development: {
    REACT_ENV,
    API_URL: "http://localhost:8888"
  },
  production: {
    REACT_ENV,
    API_URL: "http://localhost:8888"
  },
  staging: {
    REACT_ENV,
    API_URL: "http://localhost:8888"
  },
  storybook: {
    REACT_ENV,
    API_URL: "http://localhost:8888"
  }
};

export const isStorybook = () => REACT_ENV === "storybook";

export const isProduction = () => REACT_ENV === "production";

export default env[REACT_ENV] || ({} as IEnvironmentEntry);
