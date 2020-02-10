import _ from "lodash";
import theme from "styled-theming";

export const fontEnHeebo = (props: object) =>
  _.defaultTo(
    theme("font", {
      en: "Heebo, Noto Sans KR, sans-serif",
      ko: "Noto Sans KR, Heebo, sans-serif"
    })(props),
    "Heebo, Noto Sans KR, sans-serif"
  );

export const fontEnRoboto = (props: object) =>
  _.defaultTo(
    theme("font", {
      en: "Roboto, Noto Sans KR, sans-serif",
      ko: "Noto Sans KR, Heebo, sans-serif"
    })(props),
    "Roboto, Noto Sans KR, sans-serif"
  );
