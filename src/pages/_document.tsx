// SPDX-License-Identifier: LicenseRef-Blockscout

import { pickBy } from 'es-toolkit';
import type { DocumentContext } from 'next/document';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

import logRequestFromBot from 'src/server/utils/logRequestFromBot';
import * as serverTiming from 'src/server/utils/serverTiming';

import config from 'src/config';
import * as svgSprite from 'src/sprite/SpriteIcon';

const marketplaceFeature = config.features.marketplace;
const usercentrics = config.services.usercentrics;

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

    await logRequestFromBot(ctx.req, ctx.res, ctx.pathname);

    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          { /* FONTS */ }
          { /* Instruct browsers to preconnect to fonts.gstatic.com for speeding up font loading */ }
          { !(config.misc.fonts.heading?.url && config.misc.fonts.body?.url) &&
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/> }
          <link
            href={ config.misc.fonts.heading?.url ?? 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap' }
            rel="stylesheet"
          />
          <link
            href={ config.misc.fonts.body?.url ?? 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' }
            rel="stylesheet"
          />

          { /* eslint-disable-next-line @next/next/no-sync-scripts */ }
          <script src="/assets/envs.js"/>
          { config.features.multichain.isEnabled && (
            <>
              { /* eslint-disable-next-line @next/next/no-sync-scripts */ }
              <script src="/assets/multichain/config.js"/>
            </>
          ) }
          { marketplaceFeature.isEnabled && marketplaceFeature.essentialDapps && (
            <>
              { /* eslint-disable-next-line @next/next/no-sync-scripts */ }
              <script src="/assets/essential-dapps/chains.js"/>
            </>
          ) }

          { /* FAVICON */ }
          <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon/favicon-16x16.png"/>
          <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="48x48" href="/assets/favicon/favicon-48x48.png"/>
          <link rel="shortcut icon" href="/assets/favicon/favicon.ico"/>
          <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-touch-icon-180x180.png"/>
          <link rel="icon" type="image/png" sizes="192x192" href="/assets/favicon/android-chrome-192x192.png"/>
          <link rel="preload" as="image" href={ svgSprite.href }/>

          { usercentrics && (
            <script
              id="usercentrics-cmp"
              src="https://web.cmp.usercentrics.eu/ui/loader.js"
              { ...(pickBy({
                'data-settings-id': usercentrics.settingsId,
                'data-ruleset-id': usercentrics.rulesetId,
                'data-draft': usercentrics.isDraft ? 'true' : undefined,
              }, Boolean)) }
              async
            />
          ) }

        </Head>
        <body>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
