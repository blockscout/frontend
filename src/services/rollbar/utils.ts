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

export function getExceptionOriginFileName(item: Dictionary) {
  const originFileName = get(item, 'body.trace.frames[0].filename');

  return castToString(originFileName);
}

// Versionless so it keeps matching across Monaco version bumps; if Monaco is ever bundled locally
// instead of loaded from the CDN, filenames become app-owned, this stops matching, and genuine
// editor errors surface again — which is the behaviour we'd want then.
const MONACO_CDN_PATH = 'cdn.jsdelivr.net/npm/monaco-editor';

/**
 * Errors originating from the Monaco editor bundle, which we load from a third-party CDN. Their
 * failure modes — worker `importScripts` failures, AMD `define` collisions with browser-extension
 * scripts, CDN/adblock load failures — are environmental and unactionable by us, the same class we
 * already drop for `@walletconnect` / `chrome-extension://`. Render-time failures still reach users
 * through the editor's own ErrorBoundary, so dropping them here loses no user-facing signal.
 *
 * Checks the message (worker failures arrive message-only, with no stack) and every frame (some
 * traces enter through our own code and only reach the CDN bundle deeper in the stack).
 */
export function isMonacoCdnError(item: Dictionary) {
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

// Failure modes injected scripts produce as noise: a ReferenceError for a global only defined in
// their environment, or a RangeError (stack overflow) from a DOM walker recursing over a large page.
const INJECTED_SCRIPT_ERROR_CLASSES = [ 'ReferenceError', 'RangeError' ];

function haveSameOrigin(urlA: string, urlB: string): boolean {
  try {
    return new URL(urlA).origin === new URL(urlB).origin;
  } catch {
    return false;
  }
}

/**
 * Errors thrown by scripts injected into the page by the visitor's environment rather than by us:
 * userscripts (Tampermonkey/Greasemonkey) and in-app browsers (messaging / social apps, …) that add
 * their own inline scripts to the document. Unactionable and invisible to real users of the app.
 *
 * Generalised so neither the exact wording nor the specific offending symbol matters — we key on
 * where the script lives:
 *   - a `user-script:*` origin is never ours, whatever it threw;
 *   - an inline script in the page document is attributed to a document URL on our own origin (not a
 *     `/_next/` bundle asset — that is where our real code lives). Matched only for {@link
 *     INJECTED_SCRIPT_ERROR_CLASSES}, the classes such scripts throw as noise, so genuine app errors
 *     still surface. Same-origin (rather than an exact URL match) because a client-side navigation
 *     leaves the injected script attributed to the document it was parsed in, not the current route.
 */
export function isInjectedScriptError(item: Dictionary) {
  const originFileName = getExceptionOriginFileName(item);
  if (!originFileName) {
    return false;
  }

  if (originFileName.startsWith('user-script')) {
    return true;
  }

  if (!INJECTED_SCRIPT_ERROR_CLASSES.includes(getExceptionClass(item) ?? '')) {
    return false;
  }

  const requestUrl = getRequestInfo(item)?.url;
  return Boolean(requestUrl) &&
    haveSameOrigin(originFileName, requestUrl as string) &&
    !originFileName.includes('/_next/') &&
    !originFileName.endsWith('.js');
}
