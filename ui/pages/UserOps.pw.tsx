import { Box } from '@chakra-ui/react';
import React from 'react';

import { userOpsData } from 'mocks/userOps/userOps';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import UserOps from './UserOps';

test('base view +@mobile', async({ render, mockEnvs, mockTextAd, mockApiResponse }) => {
  await mockEnvs(ENVS_MAP.userOps);
  await mockTextAd();
  await mockApiResponse('user_ops', userOpsData);
  const component = await render(<Box pt={{ base: '106px', lg: 0 }}> <UserOps/> </Box>);
  await expect(component).toHaveScreenshot();
});
