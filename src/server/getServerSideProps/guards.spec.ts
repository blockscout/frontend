// SPDX-License-Identifier: LicenseRef-Blockscout

import type { GetServerSidePropsContext } from 'next';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import type { blocks } from './guards';

function makeContext(query: Record<string, string | Array<string>>): GetServerSidePropsContext {
  // the guard reads only `query`, so the rest of the context can stay absent
  return { query } as unknown as GetServerSidePropsContext;
}

// the guard reads the frozen app config, so both are imported inside `withEnvs`
async function runBlocksGuard(envs: Array<[ string, string ]>, context: GetServerSidePropsContext): ReturnType<ReturnType<typeof blocks>> {
  return withEnvs(envs, async() => {
    const guards = await import('./guards');
    const config = (await import('src/config')).default;
    return guards.blocks(config)(context);
  });
}

describe('blocks guard', () => {
  it('does nothing while the flashblocks feed is disabled', async() => {
    expect(await runBlocksGuard([], makeContext({ tab: 'flashblocks' }))).toBeUndefined();
  });

  it('lets the canonical tab id through', async() => {
    expect(await runBlocksGuard(ENVS_MAP.flashblocks, makeContext({ tab: 'subblocks' }))).toBeUndefined();
  });

  it('ignores the other tabs', async() => {
    expect(await runBlocksGuard(ENVS_MAP.flashblocks, makeContext({ tab: 'reorgs' }))).toBeUndefined();
    expect(await runBlocksGuard(ENVS_MAP.flashblocks, makeContext({}))).toBeUndefined();
  });

  it('redirects the alias to the canonical id with a temporary redirect', async() => {
    expect(await runBlocksGuard(ENVS_MAP.flashblocks, makeContext({ tab: 'flashblocks' }))).toEqual({
      redirect: { destination: '/blocks?tab=subblocks', permanent: false },
    });
  });

  it('follows the configured name in the other direction', async() => {
    const envs = [ ...ENVS_MAP.flashblocks, [ 'NEXT_PUBLIC_FLASHBLOCKS_NAME', 'flashblock' ] as [ string, string ] ];
    expect(await runBlocksGuard(envs, makeContext({ tab: 'subblocks' }))).toEqual({
      redirect: { destination: '/blocks?tab=flashblocks', permanent: false },
    });
  });

  it('keeps the other search params', async() => {
    expect(await runBlocksGuard(ENVS_MAP.flashblocks, makeContext({ tab: 'flashblocks', page: '2' }))).toEqual({
      redirect: { destination: '/blocks?tab=subblocks&page=2', permanent: false },
    });
  });
});
