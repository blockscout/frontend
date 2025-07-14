import { Box } from '@chakra-ui/react';
import React from 'react';

import { clustersDirectoryMock } from 'mocks/clusters/directory';
import { clustersLeaderboardMock } from 'mocks/clusters/leaderboard';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect, devices } from 'playwright/lib';

import Clusters from './Clusters';

test.beforeEach(async({ mockEnvs, mockTextAd }) => {
  await mockEnvs(ENVS_MAP.clusters);
  await mockTextAd();
});

test.describe('Clusters Directory Page', () => {
  test.describe('mobile', () => {
    test.use({ viewport: devices['iPhone 13 Pro'].viewport });

    test('clusters directory with data @mobile', async({ render, mockApiResponse, mockAssetResponse }) => {
      await mockAssetResponse('https://cdn.clusters.xyz/profile-image/campnetwork/lol', './playwright/mocks/image_s.jpg');
      await mockAssetResponse('https://cdn.clusters.xyz/profile-image/duck/quack', './playwright/mocks/image_s.jpg');
      await mockAssetResponse('https://cdn.clusters.xyz/profile-image/test/cluster', './playwright/mocks/image_s.jpg');
      await mockApiResponse('clusters:get_directory', clustersDirectoryMock, {
        queryParams: {
          input: JSON.stringify({
            offset: 0,
            limit: 50,
            orderBy: 'createdAt-desc',
            query: '',
          }),
        },
      });
      await mockApiResponse('clusters:get_leaderboard', clustersLeaderboardMock, {
        queryParams: {
          input: JSON.stringify({
            offset: 0,
            limit: 50,
            orderBy: 'rank-asc',
          }),
        },
      });

      const component = await render(
        <div>
          <Box h={{ base: '134px', lg: 6 }}/>
          <Clusters/>
        </div>,
      );

      await expect(component.getByText('campnetwork/lol').first()).toBeVisible();
      await expect(component.getByText('duck/quack').first()).toBeVisible();
      await expect(component.getByText('test/cluster').first()).toBeVisible();

      await expect(component).toHaveScreenshot();
    });
  });
});
