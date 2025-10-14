import React from 'react';

import { hash as addressHash } from 'mocks/address/address';
import * as chainsConfigMock from 'mocks/essentialDapps/chains';
import type { TestFnArgs } from 'playwright/lib';
import { test, expect } from 'playwright/lib';
import { ALLOWANCES } from 'stubs/revoke';

import type useApprovalsQuery from '../hooks/useApprovalsQuery';
import Content from './Content';

const testFn = async({ render }: TestFnArgs) => {
  const props = {
    selectedChain: chainsConfigMock.chainDataA,
    searchAddress: addressHash,
    isAddressMatch: false,
    coinBalanceQuery: {
      isPlaceholderData: false,
      data: { balance: '10000', balanceUsd: '10000', symbol: 'ETH', coinImage: undefined },
    },
    approvalsQuery: { data: ALLOWANCES, isPlaceholderData: false } as ReturnType<typeof useApprovalsQuery>,
    hideApproval: () => {},
  };

  const component = await render(<Content { ...props }/>);

  await expect(component).toHaveScreenshot();
};

test('base view +@dark-mode +@mobile', testFn);
