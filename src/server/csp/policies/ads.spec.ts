// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const GOOGLE_AD_MANAGER_HOSTS = [
  'https://*.googlesyndication.com',
  'https://securepubads.g.doubleclick.net',
  'https://ep2.adtrafficquality.google',
];

async function getPolicy(provider: string, isSpecifyEnabled = false) {
  return withEnvs(
    [
      [ 'NEXT_PUBLIC_AD_BANNER_PROVIDER', provider ],
      [ 'NEXT_PUBLIC_AD_TEXT_PROVIDER', 'none' ],
      [ 'NEXT_PUBLIC_AD_BANNER_ENABLE_SPECIFY', String(isSpecifyEnabled) ],
    ],
    async() => (await import('./ads')).ads(false),
  );
}

describe('ads policy', () => {
  it('lets the Specify SDK request ads and load their images', async() => {
    const policy = await getPolicy('slise', true);

    expect(policy['connect-src']).toContain('spfsrv.com');
    expect(policy['img-src']).toContain('content.specify.sh');
  });

  it('does not open the Specify hosts when Specify is disabled', async() => {
    const policy = await getPolicy('slise');

    expect(policy['connect-src']).not.toContain('spfsrv.com');
    expect(policy['img-src'] ?? []).not.toContain('content.specify.sh');
  });

  it('lets Sevio fill a zone through Google Ad Manager', async() => {
    const policy = await getPolicy('sevio');

    for (const directive of [ 'connect-src', 'script-src', 'img-src', 'frame-src' ] as const) {
      expect(policy[directive]).toEqual(expect.arrayContaining(GOOGLE_AD_MANAGER_HOSTS));
    }
  });

  it('does not open the Google hosts for other providers', async() => {
    const policy = await getPolicy('adbutler');

    expect(policy['connect-src']).not.toEqual(expect.arrayContaining(GOOGLE_AD_MANAGER_HOSTS));
  });
});
