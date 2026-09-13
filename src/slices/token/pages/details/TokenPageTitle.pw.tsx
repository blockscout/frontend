import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type * as contractsInfo from '@blockscout/contracts-info-types';

import type { ResourceError } from 'src/api/resources';

import { tokenInfo } from 'src/slices/token/mocks/info';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import TokenPageTitle from './TokenPageTitle';

test('with action button +@dark-mode +@mobile', async({ render, mockEnvs }) => {

  const tokenQuery = {
    data: tokenInfo,
  } as UseQueryResult<schemas['Token'], ResourceError<unknown>>;

  const verifiedInfoQuery = {
    data: {},
  } as UseQueryResult<contractsInfo.TokenInfo, ResourceError<unknown>>;

  const addressQuery = {} as UseQueryResult<schemas['Address'], ResourceError<unknown>>;

  await mockEnvs(ENVS_MAP.tokenActionButton);

  const component = await render(
    <TokenPageTitle
      tokenQuery={ tokenQuery }
      hash={ tokenInfo.address_hash }
      addressQuery={ addressQuery }
      verifiedInfoQuery={ verifiedInfoQuery }
    />);

  await expect(component).toHaveScreenshot();
});
