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

test('base view +@mobile', async({ render, mockApiResponse }) => {
  await mockApiResponse(
    'block_election_rewards',
    blockEpochMock.electionRewardDetails1,
    { pathParams: { height_or_hash: heightOrHash, reward_type: 'voter' } },
  );
  const component = await render(<BlockEpochElectionRewards data={ blockEpochMock.blockEpoch1 }/>, { hooksConfig });
  await component.getByText('Voting rewards').click();
  await expect(component).toHaveScreenshot();
});
