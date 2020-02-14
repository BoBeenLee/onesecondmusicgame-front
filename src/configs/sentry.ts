import * as Sentry from "@sentry/react-native";
import env from "src/configs/env";

export const initialize = () => {
  Sentry.init({
    dsn: "https://fe73c0e544da47a48fa4900dbedf7717@sentry.io/1885677",
    environment: env.REACT_ENV
  });
};
