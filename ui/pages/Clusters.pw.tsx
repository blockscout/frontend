import { Box } from '@chakra-ui/react';
import React from 'react';

import { clustersDirectoryMock } from 'mocks/clusters/directory';
import { clustersLeaderboardMock } from 'mocks/clusters/leaderboard';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import Clusters from './Clusters';

test.beforeEach(async({ mockEnvs, mockTextAd }) => {
  await mockEnvs(ENVS_MAP.clusters);
  await mockTextAd();
});

test.describe('Clusters Directory Page', () => {
  test.describe('mobile', () => {
    test('clusters directory with data +@mobile', async({ render, mockApiResponse, mockAssetResponse }) => {
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
        {
          hooksConfig: {
            router: {
              isReady: true,
            },
          },
        },
      );

      await expect(component.getByRole('link', { name: 'campnetwork/lol' })).toBeVisible({ timeout: 10000 });
      await expect(component.getByRole('link', { name: 'duck/quack' })).toBeVisible({ timeout: 10000 });
      await expect(component.getByRole('link', { name: 'test/cluster' })).toBeVisible({ timeout: 10000 });

      await expect(component).toHaveScreenshot();
    });
  });
});
