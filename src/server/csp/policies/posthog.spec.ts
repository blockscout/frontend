// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

type Envs = Array<[ string, string ]>;

const API_KEY: Envs = [ [ 'NEXT_PUBLIC_POSTHOG_API_KEY', 'phc_test' ] ];
const NO_API_KEY: Envs = [ [ 'NEXT_PUBLIC_POSTHOG_API_KEY', '' ] ];

const CLOUD_ONLY_POLICY = {
  'script-src': [ '*.posthog.com' ],
  'connect-src': [ '*.posthog.com' ],
  'img-src': [ '*.posthog.com' ],
};

function withOverrides(overrides: string): Envs {
  return [ ...API_KEY, [ 'NEXT_PUBLIC_POSTHOG_CONFIG_OVERRIDES', overrides ] ];
}

async function getPolicy(envs: Envs, isPrivateMode = false) {
  return withEnvs(envs, async() => (await import('./posthog')).posthog(isPrivateMode));
}

describe('posthog policy', () => {
  it('allows the PostHog hosts when the API key is configured', async() => {
    expect(await getPolicy(API_KEY)).toEqual(CLOUD_ONLY_POLICY);
  });

  it('is empty when no API key is configured', async() => {
    expect(await getPolicy(NO_API_KEY)).toEqual({});
  });

  it('stays empty in private mode', async() => {
    expect(await getPolicy(API_KEY, true)).toEqual({});
  });

  it('allows the origin of a custom api_host alongside the PostHog hosts', async() => {
    expect(await getPolicy(withOverrides(`{'api_host':'https://posthog.example.com/ingest/'}`))).toEqual({
      'script-src': [ '*.posthog.com', 'https://posthog.example.com' ],
      'connect-src': [ '*.posthog.com', 'https://posthog.example.com' ],
      'img-src': [ '*.posthog.com', 'https://posthog.example.com' ],
    });
  });

  it('allows a custom asset_host for scripts only', async() => {
    expect(await getPolicy(withOverrides(`{'asset_host':'https://assets.example.com'}`))).toEqual({
      ...CLOUD_ONLY_POLICY,
      'script-src': [ '*.posthog.com', 'https://assets.example.com' ],
    });
  });

  it('allows a custom flags_api_host for requests only', async() => {
    expect(await getPolicy(withOverrides(`{'flags_api_host':'https://flags.example.com:8443'}`))).toEqual({
      ...CLOUD_ONLY_POLICY,
      'connect-src': [ '*.posthog.com', 'https://flags.example.com:8443' ],
    });
  });

  it('adds nothing for a PostHog Cloud api_host', async() => {
    expect(await getPolicy(withOverrides(`{'api_host':'https://us.i.posthog.com'}`))).toEqual(CLOUD_ONLY_POLICY);
  });

  it.each([
    [ 'a same-origin path', `{'api_host':'/ingest'}` ],
    [ 'a host without a scheme', `{'api_host':'posthog.example.com'}` ],
    [ 'a non-web scheme', `{'api_host':'ftp://posthog.example.com'}` ],
    [ 'a non-string value', `{'api_host':42}` ],
    [ 'an unrelated option', `{'ui_host':'https://posthog.example.com'}` ],
  ])('adds nothing for %s', async(_, overrides) => {
    expect(await getPolicy(withOverrides(overrides))).toEqual(CLOUD_ONLY_POLICY);
  });
});
