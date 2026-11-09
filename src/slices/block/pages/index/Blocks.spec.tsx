// @vitest-environment jsdom

import React from 'react';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { beforeEach, describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

describe('Blocks page on mobile', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify({ items: [], next_page_params: null }));
  });

  it('renders no tabs bar when the Forked and Uncles views are hidden', async() => {
    await withEnvs(ENVS_MAP.blockHiddenViews, async() => {
      const { render, screen } = await import('vitest/lib');
      const { 'default': Blocks } = await import('./Blocks');

      render(<Blocks/>);

      expect(await screen.findByRole('heading', { name: 'Blocks' })).toBeTruthy();
      expect(screen.queryByRole('tablist')).toBeNull();
    });
  });

  it('renders the tabs bar when only one view is hidden', async() => {
    await withEnvs([ [ 'NEXT_PUBLIC_VIEWS_BLOCK_HIDDEN_VIEWS', '["uncles"]' ] ], async() => {
      const { render, screen } = await import('vitest/lib');
      const { 'default': Blocks } = await import('./Blocks');

      render(<Blocks/>);

      expect(await screen.findByRole('tab', { name: 'Forked' })).toBeTruthy();
    });
  });
});
