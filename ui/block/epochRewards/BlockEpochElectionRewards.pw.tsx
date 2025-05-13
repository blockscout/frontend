import React from 'react';

import * as blockEpochMock from 'mocks/blocks/epoch';
import { test, expect } from 'playwright/lib';

import BlockEpochElectionRewards from './BlockEpochElectionRewards';

const heightOrHash = '1234';
const hooksConfig = {
  router: {
    query: { height_or_hash: heightOrHash },
  },
};

test('base view', async({ render, mockApiResponse }) => {
  await mockApiResponse(
    'general:block_election_rewards',
    blockEpochMock.electionRewardDetails1,
    { pathParams: { height_or_hash: heightOrHash, reward_type: 'voter' } },
  );
  const component = await render(<BlockEpochElectionRewards data={ blockEpochMock.blockEpoch1 }/>, { hooksConfig });
  await component.getByRole('cell', { name: 'Voting rewards' }).click();
  await expect(component).toHaveScreenshot();
});

test('base view +@mobile -@default', async({ render, mockApiResponse }) => {
  await mockApiResponse(
    'general:block_election_rewards',
    blockEpochMock.electionRewardDetails1,
    { pathParams: { height_or_hash: heightOrHash, reward_type: 'voter' } },
  );
  const component = await render(<BlockEpochElectionRewards data={ blockEpochMock.blockEpoch1 }/>, { hooksConfig });
  await component.locator('div').filter({ hasText: 'Voting rewards' }).nth(3).click();
  await expect(component).toHaveScreenshot();
});
