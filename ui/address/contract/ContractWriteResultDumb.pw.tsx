import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import ContractWriteResultDumb from './ContractWriteResultDumb';

test('loading', async({ mount }) => {
  const props = {
    txInfo: {
      status: 'loading' as const,
      error: null,
    },
    result: {
      hash: '0x363574E6C5C71c343d7348093D84320c76d5Dd29' as `0x${ string }`,
    },
    onSettle: () => {},
  };

  const component = await mount(
    <TestApp>
      <ContractWriteResultDumb { ...props }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('success', async({ mount }) => {
  const props = {
    txInfo: {
      status: 'success' as const,
      error: null,
    },
    result: {
      hash: '0x363574E6C5C71c343d7348093D84320c76d5Dd29' as `0x${ string }`,
    },
    onSettle: () => {},
  };

  const component = await mount(
    <TestApp>
      <ContractWriteResultDumb { ...props }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('error +@mobile', async({ mount }) => {
  const props = {
    txInfo: {
      status: 'error' as const,
      error: {
        // eslint-disable-next-line max-len
        message: 'missing revert data in call exception; Transaction reverted without a reason string [ See: https://links.ethers.org/v5-errors-CALL_EXCEPTION ]',
      } as Error,
    },
    result: {
      hash: '0x363574E6C5C71c343d7348093D84320c76d5Dd29' as `0x${ string }`,
    },
    onSettle: () => {},
  };

  const component = await mount(
    <TestApp>
      <ContractWriteResultDumb { ...props }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('error in result', async({ mount }) => {
  const props = {
    txInfo: {
      status: 'idle' as const,
      error: null,
    },
    result: {
      message: 'wallet is not connected',
    } as Error,
    onSettle: () => {},
  };

  const component = await mount(
    <TestApp>
      <ContractWriteResultDumb { ...props }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
