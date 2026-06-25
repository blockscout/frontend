import React from 'react';

import { hash as addressHash } from 'src/slices/address/mocks/address-param';

import * as chainDataMock from 'src/features/multichain/mocks/chains';

import type { TestFnArgs } from 'playwright/lib';
import { test, expect } from 'playwright/lib';

import { APPROVALS_PAGE_SIZE } from '../constants';
import type useApprovalsQuery from '../hooks/useApprovalsQuery';
import * as revokeMock from '../mocks';
import Content from './Content';

const approvalsQueryData = {
  items: revokeMock.allowances,
  total: revokeMock.allowances.length,
  totalValueAtRiskUsd: 633,
};

const approvalsQueryDataWithPagination = {
  ...approvalsQueryData,
  total: APPROVALS_PAGE_SIZE + 1,
};

test('base view +@dark-mode +@mobile', async({ render, mockAssetResponse }: TestFnArgs) => {
  const props = {
    selectedChain: chainDataMock.chainA,
    searchAddress: addressHash,
    isAddressMatch: false,
    coinBalanceQuery: {
      isPlaceholderData: false,
      data: { balance: '12', balanceUsd: '47844', symbol: 'ETH', coinImage: revokeMock.allowances[0].tokenIcon },
    },
    approvalsQuery: { data: approvalsQueryData, isPlaceholderData: false, isError: false } as ReturnType<typeof useApprovalsQuery>,
    approvalsPage: 1,
    setApprovalsPage: () => {},
  };

  await mockAssetResponse(revokeMock.allowances[0].tokenIcon as string, './playwright/mocks/image_s.jpg');
  await mockAssetResponse(chainDataMock.chainA.logo as string, './playwright/mocks/image_md.jpg');

  const component = await render(<Content { ...props }/>);

  await expect(component).toHaveScreenshot();
});

test('with pagination', async({ render, mockAssetResponse }: TestFnArgs) => {
  const props = {
    selectedChain: chainDataMock.chainA,
    searchAddress: addressHash,
    isAddressMatch: false,
    coinBalanceQuery: {
      isPlaceholderData: false,
      data: { balance: '12', balanceUsd: '47844', symbol: 'ETH', coinImage: revokeMock.allowances[0].tokenIcon },
    },
    approvalsQuery: {
      data: approvalsQueryDataWithPagination,
      isPlaceholderData: false,
      isError: false,
    } as ReturnType<typeof useApprovalsQuery>,
    approvalsPage: 1,
    setApprovalsPage: () => {},
  };

  await mockAssetResponse(revokeMock.allowances[0].tokenIcon as string, './playwright/mocks/image_s.jpg');
  await mockAssetResponse(chainDataMock.chainA.logo as string, './playwright/mocks/image_md.jpg');

  const component = await render(<Content { ...props }/>);

  await expect(component).toHaveScreenshot();
});

test('shows error state', async({ render }: TestFnArgs) => {
  const props = {
    selectedChain: chainDataMock.chainA,
    searchAddress: addressHash,
    isAddressMatch: false,
    coinBalanceQuery: {
      isPlaceholderData: false,
      data: { balance: '12', balanceUsd: '47844', symbol: 'ETH', coinImage: undefined },
    },
    approvalsQuery: { data: approvalsQueryData, isPlaceholderData: false, isError: true } as ReturnType<typeof useApprovalsQuery>,
    approvalsPage: 1,
    setApprovalsPage: () => {},
  };

  const component = await render(<Content { ...props }/>);

  await expect(component).toHaveScreenshot();
});
