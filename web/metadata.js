const _ = require("lodash");
const isProduction = process.env.GATSBY_ENV === "production";

const siteMetadataMap = _.cond([
  [
    _.matches({ isProduction: false }),
    _.constant({
      description: "rnweb",
      og_image: "",
      siteUrl: "https://via.placeholder.com/150",
      title: "rnweb",
      titleTemplate: "%s",
      logo: "https://via.placeholder.com/150",
      backgroundColor: `#fff`,
      themeColor: `#005abf`
    })
  ],
  [
    _.matches({ isProduction: true }),
    _.constant({
      description: "rnweb",
      og_image: "https://via.placeholder.com/150",
      siteUrl: "https://via.placeholder.com/150",
      title: "rnweb",
      titleTemplate: "%s",
      logo: "https://via.placeholder.com/150",
      backgroundColor: `#fff`,
      themeColor: `#005abf`
    })
  ]
]);

module.exports = siteMetadataMap({ isProduction });
