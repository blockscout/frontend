// @vitest-environment jsdom
import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen } from 'vitest/lib';
import flushPromises from 'vitest/utils/flushPromises';
import withEnvs from 'vitest/utils/mockEnvs';
import { mockNextRouter } from 'vitest/utils/mockRouter';

const NO_CORE_API_ENVS: Array<[ string, string ]> = [
  ...ENVS_MAP.multichain,
  [ 'NEXT_PUBLIC_API_HOST', '' ],
  [ 'NEXT_PUBLIC_API_DOCS_TABS', '["eth_rpc_api","rpc_api","graphql_api"]' ],
];

describe('ApiDocs', () => {
  afterEach(() => {
    vi.doUnmock('next/router');
  });

  test('opens the GraphQL tab link without crashing on an instance without the core API', async() => {
    await withEnvs(NO_CORE_API_ENVS, async() => {
      mockNextRouter('/api-docs', '/api-docs?tab=graphql_api');
      const { 'default': ApiDocs } = await import('./ApiDocs');

      render(<ApiDocs/>);
      await flushPromises();

      expect(screen.queryByRole('tab', { name: 'ETH RPC API', selected: true })).not.toBeNull();
      expect(screen.queryByRole('tab', { name: 'GraphQL API' })).toBeNull();
    });
  });

  test('shows the GraphQL tab on an instance with the core API', async() => {
    await withEnvs([], async() => {
      mockNextRouter('/api-docs', '/api-docs?tab=rpc_api');
      const { 'default': ApiDocs } = await import('./ApiDocs');

      render(<ApiDocs/>);
      await flushPromises();

      expect(screen.queryByRole('tab', { name: 'GraphQL API' })).not.toBeNull();
    });
  });
});
