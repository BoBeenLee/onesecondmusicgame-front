console.log(`Using environment config: '${process.env.GATSBY_ENV}'`);
const siteMetadata = require("./metadata");
const path = require("path");

module.exports = {
  siteMetadata,
  plugins: [
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true, // defaults to false
        jsxPragma: `React`, // defaults to "React"
        allExtensions: true // defaults to false
      }
    },
    `gatsby-plugin-react-helmet`,
    // {
    //   resolve: `gatsby-plugin-favicon`,
    //   options: {
    //     logo: siteMetadata.logo
    //   }
    // },
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     name: `images`,
    //     path: `${__dirname}/src/images`
    //   }
    // },
    {
      resolve: `gatsby-transformer-sharp`
    },
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-sharp`,
    // {
    //   resolve: `gatsby-plugin-manifest`,
    //   options: {
    //     name: siteMetadata.title,
    //     short_name: siteMetadata.title,
    //     start_url: `/`,
    //     background_color: siteMetadata.backgroundColor,
    //     theme_color: siteMetadata.themeColor,
    //     display: `standalone`,
    //     icon: siteMetadata.logo,
    //     include_favicon: true
    //   }
    // },
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        env: {
          development: {
            policy: [{ userAgent: "*", disallow: ["/"] }]
          },
          staging: {
            policy: [{ userAgent: "*", disallow: ["/"] }]
          },
          production: {
            policy: [{ userAgent: "*", allow: "/" }]
          }
        },
        resolveEnv: () => process.env.GATSBY_ENV
      }
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /static/
        }
      }
    },
    {
      resolve: "gatsby-plugin-netlify-cache",
      options: {
        cachePublic: true
      }
    },
    {
      resolve: 'gatsby-plugin-root-import',
      options: {
        src: path.join(__dirname, 'src'),
        "@shared": path.resolve(__dirname, '../shared/lib')
      }
    }
  ]
};
