// @vitest-environment jsdom

import React from 'react';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

describe('Blocks page with the Forked and Uncles views hidden', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify({ items: [], next_page_params: null }));
  });

  afterEach(async() => {
    const { cleanup } = await import('vitest/lib');
    cleanup();
  });

  it('renders no tabs bar on mobile', async() => {
    await withEnvs(ENVS_MAP.blockHiddenViews, async() => {
      const { render, screen } = await import('vitest/lib');
      const { 'default': Blocks } = await import('./Blocks');

      render(<Blocks/>);

      expect(await screen.findByRole('heading', { name: 'Blocks' })).toBeTruthy();
      expect(screen.queryByRole('tablist')).toBeNull();
    });
  });

  it('keeps the tabs bar on desktop', async() => {
    const mobileMatchMedia = window.matchMedia;
    // jsdom's matchMedia stub matches nothing, which lands on the mobile breakpoint
    window.matchMedia = ((query: string) => ({
      ...mobileMatchMedia(query),
      matches: query.includes('min-width'),
    })) as typeof window.matchMedia;

    try {
      await withEnvs(ENVS_MAP.blockHiddenViews, async() => {
        const { render, screen } = await import('vitest/lib');
        const { 'default': Blocks } = await import('./Blocks');

        render(<Blocks/>);

        expect(await screen.findByRole('heading', { name: 'Blocks' })).toBeTruthy();
        expect(screen.getByRole('tablist')).toBeTruthy();
      });
    } finally {
      window.matchMedia = mobileMatchMedia;
    }
  });
});
