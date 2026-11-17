// @vitest-environment jsdom

import React from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest/lib';
import withEnvs from 'vitest/utils/mockEnvs';

// jsdom under vitest executes inline scripts; the real AdButler loader and placement snippets are not under test here
vi.mock('next/script', () => ({ 'default': () => null }));

const ADBUTLER_ENVS: Array<[string, string]> = [
  [ 'NEXT_PUBLIC_AD_BANNER_PROVIDER', 'adbutler' ],
  [ 'NEXT_PUBLIC_AD_ADBUTLER_CONFIG_DESKTOP', '{"id":"123","width":"728","height":"90"}' ],
  [ 'NEXT_PUBLIC_AD_ADBUTLER_CONFIG_MOBILE', '{"id":"456","width":"320","height":"100"}' ],
];

interface Placement {
  handler: (opt: { place: number }) => void;
  opt: { place: number };
}

function installAdButler() {
  const register = vi.fn();
  window.AdButler = { ads: undefined as unknown as Array<unknown>, register };
  return { register, placements: () => window.AdButler.ads as Array<Placement> };
}

describe('AdbutlerBanner', () => {
  afterEach(() => {
    cleanup();
    window.AdButler = undefined as unknown as Window['AdButler'];
  });

  it('places one desktop ad per mount and registers it with the configured zone', async() => {
    await withEnvs(ADBUTLER_ENVS, async() => {
      const { register, placements } = installAdButler();
      const { 'default': AdbutlerBanner } = await import('./AdbutlerBanner');

      const { rerender } = render(<AdbutlerBanner format="desktop"/>);

      expect(placements()).toHaveLength(1);
      expect(document.getElementById('ad-banner')?.innerHTML).toBe('<div id="placement_123_0"></div>');

      const [ { handler, opt } ] = placements();
      handler(opt);
      expect(register).toHaveBeenCalledWith(182226, '123', [ '728', '90' ], 'placement_123_0', opt);

      rerender(<AdbutlerBanner format="desktop"/>);
      expect(placements()).toHaveLength(1);
    });
  });

  it('places the mobile ad for the mobile format', async() => {
    await withEnvs(ADBUTLER_ENVS, async() => {
      const { placements } = installAdButler();
      const { 'default': AdbutlerBanner } = await import('./AdbutlerBanner');

      render(<AdbutlerBanner format="mobile"/>);

      expect(placements()).toHaveLength(1);
      expect(document.getElementById('ad-banner')?.innerHTML).toBe('<div id="placement_456_0"></div>');
    });
  });

  it('renders nothing when the adbutler provider is not configured', async() => {
    await withEnvs([ [ 'NEXT_PUBLIC_AD_BANNER_PROVIDER', 'slise' ] ], async() => {
      const { 'default': AdbutlerBanner } = await import('./AdbutlerBanner');

      render(<AdbutlerBanner/>);

      expect(document.getElementById('ad-banner')).toBeNull();
    });
  });
});
