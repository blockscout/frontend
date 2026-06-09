import React from 'react';

import { hash as addressHash } from 'src/slices/address/mocks/address';

import * as chainDataMock from 'src/features/multichain/mocks/chains';

import type { TestFnArgs } from 'playwright/lib';
import { test, expect } from 'playwright/lib';

import type useApprovalsQuery from '../hooks/useApprovalsQuery';
import * as revokeMock from '../mocks';
import Content from './Content';

test('base view +@dark-mode +@mobile', async({ render, mockAssetResponse }: TestFnArgs) => {
  const props = {
    selectedChain: chainDataMock.chainA,
    searchAddress: addressHash,
    isAddressMatch: false,
    coinBalanceQuery: {
      isPlaceholderData: false,
      data: { balance: '12', balanceUsd: '47844', symbol: 'ETH', coinImage: revokeMock.allowances[0].tokenIcon },
    },
    approvalsQuery: { data: revokeMock.allowances, isPlaceholderData: false } as ReturnType<typeof useApprovalsQuery>,
    hideApproval: () => {},
  };

  await mockAssetResponse(revokeMock.allowances[0].tokenIcon as string, './playwright/mocks/image_s.jpg');
  await mockAssetResponse(chainDataMock.chainA.logo as string, './playwright/mocks/image_md.jpg');

  const component = await render(<Content { ...props }/>);

  await expect(component).toHaveScreenshot();
});
