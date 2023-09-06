import { ColorModeScript } from '@chakra-ui/react';
import type { DocumentContext } from 'next/document';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

import * as serverTiming from 'nextjs/utils/serverTiming';

import config from 'configs/app';
import theme from 'theme';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = async() => {
      const start = Date.now();
      const result = await originalRenderPage();
      const end = Date.now();

      serverTiming.appendValue(ctx.res, 'renderPage', end - start);

      return result;
    };

    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          { /* FONTS */ }
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />

          { /* FAVICON */ }
          <link rel="icon" href="/favicon/favicon.ico" sizes="48x48"/>
          <link rel="icon" sizes="32x32" type="image/png" href="/favicon/favicon-32x32.png"/>
          <link rel="icon" sizes="16x16" type="image/png"href="/favicon/favicon-16x16.png"/>
          <link rel="apple-touch-icon" href="/favicon/apple-touch-icon-180x180.png"/>
          <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg"/>

          { /* OG TAGS */ }
          <meta property="og:title" content="Blockscout: A block explorer designed for a decentralized world."/>
          <meta
            property="og:description"
            // eslint-disable-next-line max-len
            content="Blockscout is the #1 open-source blockchain explorer available today. 100+ chains and counting rely on Blockscout data availability, APIs, and ecosystem tools to support their networks."
          />
          <meta property="og:image" content={ config.app.baseUrl + '/static/og.png' }/>
          <meta property="og:site_name" content="Blockscout"/>
          <meta property="og:type" content="website"/>
          <meta name="twitter:card" content="summary_large_image"/>
          <meta property="twitter:image" content={ config.app.baseUrl + '/static/og_twitter.png' }/>
        </Head>
        <body>
          <ColorModeScript initialColorMode={ theme.config.initialColorMode }/>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
