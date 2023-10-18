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
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <link rel="icon" sizes="32x32" type="image/png" href="/static/favicon-32x32.png"/>
          <link rel="icon" sizes="16x16" type="image/png"href="/static/favicon-16x16.png"/>
          <link rel="apple-touch-icon" sizes="180x180" href="/static/apple-touch-icon.png"/>
          <link rel="mask-icon" href="/static/safari-pinned-tab.svg" color="#5bbad5"/>
          <meta property="og:title" content="Canto EVM Explorer"/>
          <meta
            property="og:description"
            // eslint-disable-next-line max-len
            content="Canto is a permissionless general-purpose blockchain running the Ethereum Virtual Machine (EVM). It was built to deliver on the promise of DeFi – that through a post-traditional financial movement, new systems will be made accessible, transparent, decentralized, and free"
          />
          <meta property="og:image" content={ config.app.baseUrl + '/static/og.png' }/>
          <meta property="og:site_name" content="Canto Explorer"/>
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
