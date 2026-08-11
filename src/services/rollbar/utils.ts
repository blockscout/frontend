// SPDX-License-Identifier: LicenseRef-Blockscout

import { get } from 'es-toolkit/compat';
import type { Dictionary } from 'rollbar';

import { castToString } from 'src/toolkit/utils/guards';

export function isBot(userAgent: string | undefined) {
  if (!userAgent) return false;

  const botPatterns = [
    'Googlebot', // Google
    'Baiduspider', // Baidu
    'bingbot', // Bing
    'YandexBot', // Yandex
    'DuckDuckBot', // DuckDuckGo
    'Slurp', // Yahoo
    'Applebot', // Apple
    'facebookexternalhit', // Facebook
    'Twitterbot', // Twitter
    'rogerbot', // Moz
    'Alexa', // Alexa
    'AhrefsBot', // Ahrefs
    'SemrushBot', // Semrush
    'spider', // Generic spiders
    'crawler', // Generic crawlers
  ];

  return botPatterns.some(pattern =>
    userAgent.toLowerCase().includes(pattern.toLowerCase()),
  );
}

export function isHeadlessBrowser(userAgent: string | undefined) {
  if (!userAgent) return false;

  if (
    userAgent.includes('headless') ||
    userAgent.includes('phantomjs') ||
    userAgent.includes('selenium') ||
    userAgent.includes('puppeteer')
  ) {
    return true;
  }
}

export function isNextJsChunkError(url: unknown) {
  if (typeof url !== 'string') return false;
  return url.includes('/_next/');
}

export function getRequestInfo(item: Dictionary): { url: string } | undefined {
  if (
    !item.request ||
      item.request === null ||
      typeof item.request !== 'object' ||
      !('url' in item.request) ||
      typeof item.request.url !== 'string'
  ) {
    return undefined;
  }
  return { url: item.request.url };
}

export function getExceptionClass(item: Dictionary) {
  const exceptionClass = get(item, 'body.trace.exception.class');

  return castToString(exceptionClass);
}

const IGNORED_EXCEPTION_CLASSES = [
  // React errors — "NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed
  // is not a child of this node." — provoked by browser extensions mutating the DOM React owns.
  // See https://github.com/facebook/react/issues/11538
  'NotFoundError',

  'AbortError',
];

/**
 * Exception classes we drop wherever they surface. Window-free by design so both the browser instance
 * and the server-side error-page instance can share it — the error-page `checkIgnore` reuses only this
 * check, not the browser instance's bot / headless checks, which read `window` (absent on the server).
 */
export function isIgnoredExceptionClass(item: Dictionary): boolean {
  const exceptionClass = getExceptionClass(item);
  return exceptionClass !== undefined && IGNORED_EXCEPTION_CLASSES.includes(exceptionClass);
}

// Versionless so it keeps matching across Monaco version bumps; if Monaco is ever bundled locally
// instead of loaded from the CDN, filenames become app-owned, this stops matching, and genuine
// editor errors surface again — which is the behaviour we'd want then.
const MONACO_CDN_PATH = 'cdn.jsdelivr.net/npm/monaco-editor';

/**
 * Errors originating from the Monaco editor bundle, which we load from a third-party CDN. Their
 * failure modes — worker `importScripts` failures, AMD `define` collisions with browser-extension
 * scripts, CDN/adblock load failures — are environmental and unactionable by us. Render-time failures
 * still reach users through the editor's own ErrorBoundary, so dropping them here loses no signal.
 *
 * Still needed after the queue's own-bundle origin gate: a trace whose origin frame is our `/_next/`
 * code but which only reaches the CDN bundle deeper in the stack passes that gate, and this catches it.
 *
 * Checks the message (worker failures arrive message-only, with no stack) and every frame (some
 * traces enter through our own code and only reach the CDN bundle deeper in the stack).
 */
export function isMonacoCdnError(item: Dictionary): boolean {
  const message = castToString(get(item, 'body.message.body'));
  if (message?.includes(MONACO_CDN_PATH)) {
    return true;
  }

  const frames = get(item, 'body.trace.frames');
  if (!Array.isArray(frames)) {
    return false;
  }

  return frames.some((frame) => castToString(get(frame, 'filename'))?.includes(MONACO_CDN_PATH));
}
