import Rate, { AndroidMarket } from "react-native-rate";

export const requestRating = () => {
  return new Promise((resolve, reject) => {
    const options = {
      AppleAppID: "1493107650",
      GooglePackageName: "kr.nexters.onesecondmusicgame",
      AmazonPackageName: "kr.nexters.onesecondmusicgame",
      OtherAndroidURL: "http://www.randomappstore.com/app/47172391",
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: false,
      openAppStoreIfInAppFails: true,
      fallbackPlatformURL: "http://www.mywebsite.com/myapp.html"
    };
    Rate.rate(options, success => {
      if (success) {
        resolve(success);
        return;
      }
      reject(success);
    });
  });
};
