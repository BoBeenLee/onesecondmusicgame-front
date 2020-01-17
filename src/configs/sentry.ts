import * as Sentry from "@sentry/react-native";

export const initialize = () => {
  Sentry.init({
    dsn: "https://fe73c0e544da47a48fa4900dbedf7717@sentry.io/1885677"
  });
};
