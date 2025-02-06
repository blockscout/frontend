import { get } from 'es-toolkit/compat';
import type { Dictionary } from 'rollbar';

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

  return typeof exceptionClass === 'string' ? exceptionClass : undefined;
}
