import { css } from "styled-components";

const media = {
  desktop: (first: any, ...args: any[]) => css`
    @media (min-width: 48rem) {
      ${css(first, ...args)};
    }
  `,
  mobile: (first: any, ...args: any[]) => css`
    @media (min-width: 22.5rem) {
      ${css(first, ...args)};
    }
  `
  // mobileAndTablet: (first: any, ...args: any[]) => css`
  //   @media (max-width: 1023px) {
  //     ${css(first, ...args)};
  //   }
  // `,
  // tablet: (first: any, ...args: any[]) => css`
  //   @media (max-width: 1023px) and (min-width: 600px) {
  //     ${css(first, ...args)};
  //   }
  // `,
  // tabletAndDesktop: (first: any, ...args: any[]) => css`
  //   @media (min-width: 600px) {
  //     ${css(first, ...args)};
  //   }
  // `
};

export { media };
