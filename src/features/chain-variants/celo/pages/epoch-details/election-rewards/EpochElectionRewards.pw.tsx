import React from 'react';

import * as tokenMock from 'src/slices/token/mocks/info';

import * as celoEpochMock from 'src/features/chain-variants/celo/mocks/epoch';

import { test, expect } from 'playwright/lib';

import EpochElectionRewards from './EpochElectionRewards';

const number = '1234';
const hooksConfig = {
  router: {
    query: { number },
  },
};

test('base view', async({ render, mockApiResponse, mockAssetResponse }) => {
  await mockAssetResponse(tokenMock.tokenInfoERC20a.icon_url as string, './playwright/mocks/image_s.jpg');
  await mockApiResponse(
    'core:epoch_celo_election_rewards',
    celoEpochMock.electionRewardDetails1,
    { pathParams: { number, reward_type: 'voter' } },
  );
  const component = await render(<EpochElectionRewards data={ celoEpochMock.epoch1 }/>, { hooksConfig });
  await component.getByRole('cell', { name: 'Voting rewards' }).click();
  await expect(component).toHaveScreenshot();
});
