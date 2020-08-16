module.exports = {
  assets: ["./assets/fonts/"],
  dependencies: {
    "react-native-navigation": {
      platforms: {
        ios: null
      }
    },
    "lottie-react-native": {
      platforms: {
        android: null // disable Android platform, other platforms will still autolink if provided
      }
    },
    "react-native-code-push": {
      platforms: {
        ios: null,
        android: null // disable Android platform, other platforms will still autolink if provided
      }
    },
    "rn-fetch-blob": {
      platforms: {
        ios: null,
        android: null // disable Android platform, other platforms will still autolink if provided
      }
    }
  }
};
