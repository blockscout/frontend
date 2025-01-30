import { ColorModeScript } from '@chakra-ui/react';
import type { DocumentContext } from 'next/document';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

import * as serverTiming from 'nextjs/utils/serverTiming';

import theme from 'theme';


import { inter, drukWide } from 'theme/foundations/typography';

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

// className={inter.className}

  render() {
    return (
      <Html lang="en">
        <Head>
          { /* eslint-disable-next-line @next/next/no-sync-scripts */ }
          <script src="/envs.js"/>

          { /* FAVICON */ }
          <link rel="icon" href="/favicon/favicon.ico" sizes="48x48"/>
          <link rel="icon" sizes="32x32" type="image/png" href="/favicon/favicon-32x32.png"/>
          <link rel="icon" sizes="16x16" type="image/png"href="/favicon/favicon-16x16.png"/>
          <link rel="apple-touch-icon" href="/favicon/apple-touch-icon-180x180.png"/>
          <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg"/>
        </Head>
        <body className={`${inter.variable} ${drukWide.variable}`}>
          <ColorModeScript initialColorMode={ theme.config.initialColorMode }/>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
