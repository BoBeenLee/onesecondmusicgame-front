import { css } from "styled-components";

import colors from "src/styles/colors";
import { fontEnHeebo, fontEnRoboto } from "./theme";

export default {
  textStyle: css`
    font-size: 60px;
    color: ${colors.textDarkbgTitle};
    letter-spacing: 1px;
    line-height: 1.17;
    text-align: center;
    font-family: ${fontEnRoboto};
    font-style: italic;
    font-weight: black;
  `,

  textStyle2: css`
    color: ${colors.textDarkbgTitle};
    font-size: 40px;
    font-family: ${fontEnRoboto};
    font-style: italic;
    font-weight: 700;
  `,

  h1Darkbg: css`
    font-size: 72px;
    color: ${colors.textDarkbgTitle};
    letter-spacing: -1px;
    line-height: 1.14;
    font-family: ${fontEnHeebo};
    font-weight: 700;

    @media (max-width: 1023px) {
      font-size: 48px;
    }
  `,

  h1Whitebg: css`
    font-size: 72px;
    color: #1b222d;
    letter-spacing: -1px;
    line-height: 1.14;
    font-family: ${fontEnHeebo};
    font-weight: 700;

    @media (max-width: 1023px) {
      font-size: 48px;
    }
  `,

  h4Darkbg: css`
    font-size: 24px;
    color: ${colors.textDarkbgTitle};
    letter-spacing: -0.2px;
    line-height: 1.25;
    font-family: ${fontEnHeebo};
    font-weight: 700;
  `,

  p1Darkbg: css`
    color: ${colors.textDarkbgParagraph};
    line-height: 1.5;
    font-size: 24px;
    font-family: ${fontEnRoboto};
    font-weight: 400;

    @media (max-width: 1023px) {
      font-size: 20px;
    }
  `,

  h3Whitebg: css`
    font-size: 36px;
    color: ${colors.textWhitebgTitle};
    letter-spacing: -0.5px;
    line-height: 1.19;
    font-family: ${fontEnHeebo};
    font-weight: 700;

    @media (max-width: 1023px) {
      font-size: 24px;
    }
  `,

  h2Darkbg: css`
    font-size: 48px;
    color: ${colors.textDarkbgTitle};
    letter-spacing: -1px;
    line-height: 1.29;
    font-family: ${fontEnHeebo};
    font-weight: 700;
  `,

  h3Darkbg: css`
    font-size: 36px;
    color: ${colors.textDarkbgTitle};
    letter-spacing: -0.5px;
    line-height: 1.19;
    font-family: ${fontEnHeebo};
    font-weight: 700;

    @media (max-width: 1023px) {
      font-size: 24px;
    }
  `,

  h2Whitebg: css`
    font-size: 48px;
    color: ${colors.textWhitebgTitle};
    letter-spacing: -1px;
    line-height: 1.29;
    font-family: ${fontEnHeebo};
    font-weight: 700;

    @media (max-width: 1023px) {
      font-size: 36px;
    }
  `,

  h4Whitebg: css`
    font-size: 24px;
    color: ${colors.textWhitebgSubtitle};
    letter-spacing: -0.2px;
    line-height: 1.25;
    font-family: ${fontEnHeebo};
    font-weight: 700;
  `,

  p1Whitebg: css`
    color: ${colors.textWhitebgParagraph};
    line-height: 1.5;
    font-size: 24px;
    font-family: ${fontEnRoboto};
    font-weight: 400;
  `,

  p2Darkbg: css`
    font-size: 20px;
    color: ${colors.textDarkbgParagraph};
    letter-spacing: 0.05px;
    line-height: 1.5;
    font-family: ${fontEnRoboto};
    font-weight: 400;

    @media (max-width: 1023px) {
      font-size: 16px;
    }
  `,

  p3Whitebg: css`
    font-size: 16px;
    color: ${colors.textWhitebgParagraph};
    letter-spacing: 0.1px;
    line-height: 1.44;
    font-family: ${fontEnRoboto};
    font-weight: 400;
    @media (max-width: 1023px) {
      font-size: 14px;
    }
  `,

  p3Darkbg: css`
    font-size: 16px;
    color: ${colors.textDarkbgParagraph};
    letter-spacing: 0.1px;
    line-height: 1.44;
    font-family: ${fontEnRoboto};
    font-weight: 400;
    @media (max-width: 1023px) {
      font-size: 14px;
    }
  `,

  p4Darkbg: css`
    font-size: 14px;
    color: ${colors.textDarkbgParagraph};
    line-height: 1.5;
    font-family: ${fontEnRoboto};
    font-weight: 400;
  `,

  p4Whitebg: css`
    font-size: 14px;
    color: ${colors.textWhitebgParagraph};
    line-height: 1.5;
    font-family: ${fontEnRoboto};
    font-weight: 400;
  `,

  p2Whitebg: css`
    font-size: 20px;
    color: ${colors.textWhitebgParagraph};
    letter-spacing: 0.05px;
    line-height: 1.5;
    font-family: ${fontEnRoboto};
    font-weight: 400;

    @media (max-width: 1023px) {
      font-size: 16px;
    }
  `,

  p5Whitebg: css`
    font-size: 12px;
    color: ${colors.textWhitebgParagraph};
    letter-spacing: 0.15px;
    line-height: 1.5;
    font-family: ${fontEnRoboto};
    font-weight: 400;
  `,

  p5Darkbg: css`
    color: ${colors.textDarkbgParagraph};
    letter-spacing: 0.15px;
    line-height: 1.5;
    font-size: 12px;
    font-family: ${fontEnRoboto};
    font-weight: 400;
  `
};
