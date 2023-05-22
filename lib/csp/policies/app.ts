import type CspDev from 'csp-dev';

import appConfig from 'configs/app/config';

import { KEY_WORDS } from '../utils';

const MAIN_DOMAINS = [
  `*.${ appConfig.host }`,
  appConfig.host,
  appConfig.visualizeApi.endpoint,
].filter(Boolean);
// eslint-disable-next-line no-restricted-properties
const REPORT_URI = process.env.SENTRY_CSP_REPORT_URI;

export function app(): CspDev.DirectiveDescriptor {
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

      // webpack hmr in safari doesn't recognize localhost as 'self' for some reason
      appConfig.isDev ? 'ws://localhost:3000/_next/webpack-hmr' : '',

      // API
      appConfig.api.endpoint,
      appConfig.api.socket,
      appConfig.statsApi.endpoint,
      appConfig.visualizeApi.endpoint,
      appConfig.contractInfoApi.endpoint,
      appConfig.adminServiceApi.endpoint,

      // chain RPC server
      appConfig.network.rpcUrl,
      'https://infragrid.v.network', // RPC providers

      // github (spec for api-docs page)
      'raw.githubusercontent.com',
    ].filter(Boolean),

    'script-src': [
      KEY_WORDS.SELF,
      ...MAIN_DOMAINS,

      // next.js generates and rebuilds source maps in dev using eval()
      // https://github.com/vercel/next.js/issues/14221#issuecomment-657258278
      appConfig.isDev ? KEY_WORDS.UNSAFE_EVAL : '',

      // hash of ColorModeScript
      '\'sha256-e7MRMmTzLsLQvIy1iizO1lXf7VWYoQ6ysj5fuUzvRwE=\'',
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
      '*', // see comment for img-src directive
    ],

    'font-src': [
      KEY_WORDS.DATA,
    ],

    'object-src': [
      KEY_WORDS.NONE,
    ],

    'base-uri': [
      KEY_WORDS.NONE,
    ],

    'frame-src': [
      // improve: allow only frames from marketplace config
      '*',
    ],

    ...(REPORT_URI && !appConfig.isDev ? {
      'report-uri': [
        REPORT_URI,
      ],
    } : {}),
  };
}
