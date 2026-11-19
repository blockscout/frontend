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

// Keep it free of `window`: the server-side error-page instance runs it too.
export function isIgnoredExceptionClass(item: Dictionary): boolean {
  const exceptionClass = getExceptionClass(item);
  return exceptionClass !== undefined && IGNORED_EXCEPTION_CLASSES.includes(exceptionClass);
}

// Versionless, so it keeps matching across Monaco version bumps.
const MONACO_CDN_PATH = 'cdn.jsdelivr.net/npm/monaco-editor';

// Monaco loads from a CDN, and its failures there (worker `importScripts`, AMD `define` collisions with
// extension scripts, blocked loads) are environmental. Every frame is checked because a trace that starts in
// our bundle passes the queue's own-bundle origin gate, and the message because worker failures have no stack.
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
