import { uniq } from 'es-toolkit';

import type { MockRegistration } from '../fixtures/mockRegistry';

function pathnameOf(url: string): string {
  return new URL(url).pathname;
}

export function formatUnmockedRequests(unmockedUrls: ReadonlyArray<string>, registrations: ReadonlyArray<MockRegistration>): string {
  const urls = uniq(unmockedUrls);
  const pathnames = new Set(urls.map(pathnameOf));
  const lines = [ 'Unmocked localhost requests. Mock each one, or answer it with an error status when the test expects a failure:' ];

  for (const url of urls) {
    lines.push(`  ${ url }`);
    const samePathname = registrations.filter((registration) => pathnameOf(registration.url) === pathnameOf(url));
    if (samePathname.length === 0) {
      lines.push('    no registered matcher shares this pathname');
    }
    for (const registration of samePathname) {
      lines.push(`    ${ registration.fixture }: ${ registration.url }`);
    }
  }

  const others = registrations.filter((registration) => !pathnames.has(pathnameOf(registration.url))).length;
  lines.push(`  ${ others } other matchers registered`);

  return lines.join('\n');
}
