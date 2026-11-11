// @vitest-environment jsdom

import React from 'react';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';
import { mockViewport } from 'vitest/utils/mockViewport';

// every test re-imports the whole blocks page (withEnvs resets modules), which took >5s on a CI runner
const TEST_TIMEOUT = 20_000;

describe('Blocks page with the Forked and Uncles views hidden', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify({ items: [], next_page_params: null }));
  });

  afterEach(async() => {
    const { cleanup } = await import('vitest/lib');
    cleanup();
  });

  it('renders no tabs bar on mobile', { timeout: TEST_TIMEOUT }, async() => {
    mockViewport('base');

    await withEnvs(ENVS_MAP.blockHiddenViews, async() => {
      const { render, screen } = await import('vitest/lib');
      const { 'default': Blocks } = await import('./Blocks');

      render(<Blocks/>);

      expect(await screen.findByRole('heading', { name: 'Blocks' })).toBeTruthy();
      expect(screen.queryByRole('tablist')).toBeNull();
    });
  });

  it('keeps the tabs bar on desktop', { timeout: TEST_TIMEOUT }, async() => {
    await withEnvs(ENVS_MAP.blockHiddenViews, async() => {
      const { render, screen } = await import('vitest/lib');
      const { 'default': Blocks } = await import('./Blocks');

      render(<Blocks/>);

      expect(await screen.findByRole('heading', { name: 'Blocks' })).toBeTruthy();
      expect(screen.getByRole('tablist')).toBeTruthy();
    });
  });
});
