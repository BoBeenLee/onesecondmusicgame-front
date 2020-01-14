import CryptoJS from "crypto-js";

export const makeHmacSHA1 = (message: string, key: string) => {
  return CryptoJS.HmacSHA1(message, key).toString();
};
