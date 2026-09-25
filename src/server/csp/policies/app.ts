// SPDX-License-Identifier: LicenseRef-Blockscout

import type CspDev from 'csp-dev';

import config from 'src/config';

import { KEY_WORDS } from '../utils';

const MAIN_DOMAINS = [
  `*.${ config.app.host }`,
  config.app.host,
].filter(Boolean);

const COLOR_MODE_SCRIPT_HASHES = [
  // defaultTheme: system
  '\'sha256-yYJq8IP5/WhJj6zxyTmujEqBFs/MufRufp2QKJFU76M=\'',
  // defaultTheme: dark
  '\'sha256-Os32ny+s3zEaX+XxoAVngBThnQv/IOycQlrqgxXOgRI=\'',
  // defaultTheme: light
  '\'sha256-/ZmmXHg9XaKeWp0VJihBDn4cJ7lLM1jUtpgqdgVFvmA=\'',
];

const externalFontsDomains = (() => {
  try {
    return [
      config.misc.fonts.heading?.url,
      config.misc.fonts.body?.url,
    ]
      .filter(Boolean)
      .map((urlString) => new URL(urlString))
      .map((url) => url.hostname);
  } catch (error) {}
})();

export function app(isPrivateMode = false, primerScriptHashes: Array<string> = []): CspDev.DirectiveDescriptor {
  return {
    'default-src': [
      // KEY_WORDS.NONE,
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1242902
      // need 'self' here to avoid an error with prefetch nextjs chunks in firefox
      KEY_WORDS.SELF,
    ],

    'connect-src': [
      KEY_WORDS.SELF,
      ...MAIN_DOMAINS,

      // Next.js WebSocket HMR
      config.app.isDev ? 'ws://localhost:3000/_next/webpack-hmr' : '',

      // APIs
      ...Object.values(config.apis).filter(Boolean).map((api) => api.endpoint),
      ...Object.values(config.apis).filter(Boolean).map((api) => api.socketEndpoint),

      // chain RPC server
      ...config.chain.rpcUrls,
      'https://infragrid.v.network', // RPC providers

      // github (spec for api-docs page)
      'raw.githubusercontent.com',

      // github api (used for Stylus contract verification)
      'api.github.com',

      // google fonts
      'fonts.gstatic.com',
    ].filter(Boolean),

    'script-src': [
      KEY_WORDS.SELF,
      ...MAIN_DOMAINS,

      // next.js generates and rebuilds source maps in dev using eval()
      // https://github.com/vercel/next.js/issues/14221#issuecomment-657258278
      config.app.isDev ? KEY_WORDS.UNSAFE_EVAL : '',

      // next-themes bakes defaultTheme into its inline script, so every default has its own hash;
      // a blocked script leaves <html> without the color mode class until hydration (white flash on dark themes)
      ...COLOR_MODE_SCRIPT_HASHES,

      // CapybaraRunner
      '\'sha256-5+YTmTcBwCYdJ8Jetbr6kyjGp0Ry/H7ptpoun6CrSwQ=\'',

      // early-fetch primer scripts (src/server/primedRequests), hashed at startup
      ...primerScriptHashes,
    ],

    'style-src': [
      KEY_WORDS.SELF,
      ...MAIN_DOMAINS,

      // yes, it is unsafe as it stands, but
      // - we cannot use hashes because all styles are generated dynamically
      // - we cannot use nonces since we are not following along SSR path
      // - and still there is very small damage that can be cause by CSS-based XSS-attacks
      // so we hope we are fine here till the first major incident :)
      KEY_WORDS.UNSAFE_INLINE,

      // google fonts
      'fonts.googleapis.com',

      // custom fonts are loaded as external stylesheets
      ...(externalFontsDomains || []),
    ],

    'img-src': [
      KEY_WORDS.SELF,
      KEY_WORDS.DATA,
      ...MAIN_DOMAINS,

      // we agreed that using wildcard for images is mostly safe
      // why do we have to use it? the main reason is that for NFT and inventory pages we get resources urls from API only on the client
      // so they cannot be added to the policy on the server
      // there could be 3 possible workarounds
      //    a/ use server side rendering approach, that we don't want to do
      //    b/ wrap every image/video in iframe with a source to static page for which we enforce certain img-src rule;
      //        the downsides is page performance slowdown and code complexity (have to manage click on elements, color mode for
      //        embedded page, etc)
      //    c/ use wildcard for img-src directive; this can lead to some security vulnerabilities but we were unable to find evidence
      //        that loose img-src directive alone could cause serious flaws on the site as long as we keep script-src and connect-src strict
      //
      // feel free to propose alternative solution and fix this
      '*',
    ],

    'media-src': [
      KEY_WORDS.BLOB,
      '*', // see comment for img-src directive
    ],

    'font-src': [
      KEY_WORDS.DATA,
      KEY_WORDS.SELF,
      ...MAIN_DOMAINS,

      // google fonts
      'fonts.gstatic.com',
      'fonts.googleapis.com',

      // external fonts
      ...(externalFontsDomains || []),
    ],

    'object-src': [
      KEY_WORDS.NONE,
    ],

    'base-uri': [
      KEY_WORDS.NONE,
    ],

    // Restrict frame-src in private mode to prevent iframe tracking
    // In normal mode, frame-src is also set by marketplace.ts when marketplace is enabled
    ...(isPrivateMode ? {} as CspDev.DirectiveDescriptor : {
      'frame-src': [
        // could be a marketplace app or NFT media (html-page)
        '*',
      ],
    }),

    'frame-ancestors': [
      KEY_WORDS.SELF,

      // allow remix.ethereum.org to embed our contract page in iframe
      'remix.ethereum.org',
    ],
  };
}
