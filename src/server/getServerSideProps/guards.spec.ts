// SPDX-License-Identifier: LicenseRef-Blockscout

import type { GetServerSidePropsContext } from 'next';

import type config from 'src/config';

import { describe, expect, it } from 'vitest';

import { blocksTab } from './guards';

type FlashblocksFeature = (typeof config)['features']['flashblocks'];

const SUBBLOCKS_FEED: FlashblocksFeature = {
  title: 'Flashblocks',
  isEnabled: true,
  socketUrl: 'wss://localhost:3120/ws',
  type: 'optimism',
  name: 'subblock',
  tabIds: [ 'subblocks', 'flashblocks' ],
};
const FLASHBLOCKS_FEED: FlashblocksFeature = { ...SUBBLOCKS_FEED, name: 'flashblock', tabIds: [ 'flashblocks', 'subblocks' ] };
const DISABLED_FEED: FlashblocksFeature = { title: 'Flashblocks', isEnabled: false };

// the guard reads only the flashblocks feature and the request query, so the rest of both can stay absent
function runBlocksTab(flashblocks: FlashblocksFeature, query: Record<string, string | Array<string>>): ReturnType<ReturnType<typeof blocksTab>> {
  const chainConfig = { features: { flashblocks } } as unknown as typeof config;
  const context = { query } as unknown as GetServerSidePropsContext;
  return blocksTab(chainConfig)(context);
}

describe('blocksTab guard', () => {
  it('does nothing while the feed is disabled', async() => {
    expect(await runBlocksTab(DISABLED_FEED, { tab: 'flashblocks' })).toBeUndefined();
  });

  it('lets the canonical tab id through', async() => {
    expect(await runBlocksTab(SUBBLOCKS_FEED, { tab: 'subblocks' })).toBeUndefined();
  });

  it('ignores the other tabs', async() => {
    expect(await runBlocksTab(SUBBLOCKS_FEED, { tab: 'reorgs' })).toBeUndefined();
    expect(await runBlocksTab(SUBBLOCKS_FEED, {})).toBeUndefined();
  });

  it('redirects the alias to the canonical id with a temporary redirect', async() => {
    expect(await runBlocksTab(SUBBLOCKS_FEED, { tab: 'flashblocks' })).toEqual({
      redirect: { destination: '/blocks?tab=subblocks', permanent: false },
    });
  });

  it('follows the configured name in the other direction', async() => {
    expect(await runBlocksTab(FLASHBLOCKS_FEED, { tab: 'subblocks' })).toEqual({
      redirect: { destination: '/blocks?tab=flashblocks', permanent: false },
    });
  });

  it('keeps the other search params', async() => {
    expect(await runBlocksTab(SUBBLOCKS_FEED, { tab: 'flashblocks', page: '2' })).toEqual({
      redirect: { destination: '/blocks?tab=subblocks&page=2', permanent: false },
    });
  });
});
