// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const API_KEY: Array<[ string, string ]> = [ [ 'NEXT_PUBLIC_POSTHOG_API_KEY', 'phc_test' ] ];
const NO_API_KEY: Array<[ string, string ]> = [ [ 'NEXT_PUBLIC_POSTHOG_API_KEY', '' ] ];

async function getPolicy(envs: Array<[ string, string ]>, isPrivateMode = false) {
  return withEnvs(envs, async() => (await import('./posthog')).posthog(isPrivateMode));
}

describe('posthog policy', () => {
  it('allows the PostHog hosts when the API key is configured', async() => {
    expect(await getPolicy(API_KEY)).toEqual({
      'script-src': [ '*.posthog.com' ],
      'connect-src': [ '*.posthog.com' ],
      'img-src': [ '*.posthog.com' ],
    });
  });

  it('is empty when no API key is configured', async() => {
    expect(await getPolicy(NO_API_KEY)).toEqual({});
  });

  it('stays empty in private mode', async() => {
    expect(await getPolicy(API_KEY, true)).toEqual({});
  });
});
