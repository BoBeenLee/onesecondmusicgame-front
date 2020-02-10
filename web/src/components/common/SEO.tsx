import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import Helmet from "react-helmet";

interface ISEOProps {
  description?: string;
  lang: string;
  meta: any[];
  keywords: string[];
  title?: string;
}

function SEO({ description, lang, meta, keywords, title }: ISEOProps) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            titleTemplate
            description
            siteUrl
            og_image
          }
        }
      }
    `
  );
  const metaTitle = title || site.siteMetadata.title;
  const metaDescription = description || site.siteMetadata.description;
  const metaUrl = site.siteMetadata.siteUrl;
  const metaImage = site.siteMetadata.og_image;

  return (
    <Helmet
      htmlAttributes={{
        lang
      }}
      title={metaTitle}
      titleTemplate={`%s`}
    >
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0, user-scalable=no"
      />
      <meta name="description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content="rnweb" />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta name="keywords" content="rnweb" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:creator" content="rnweb" />
    </Helmet>
  );
}

SEO.defaultProps = {
  keywords: [],
  lang: `en`,
  meta: []
};

export default SEO;
