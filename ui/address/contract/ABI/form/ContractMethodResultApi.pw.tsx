import React from 'react';

import type { FormSubmitResultApi } from '../types';

import * as contractMethodsMock from 'mocks/contract/methods';
import { test, expect } from 'playwright/lib';

import ContractMethodResultApi from './ContractMethodResultApi';

const item = contractMethodsMock.read[0];
const onSettle = () => Promise.resolve();

test.use({ viewport: { width: 500, height: 500 } });

test('default error', async({ render }) => {
  const result: FormSubmitResultApi['result'] = {
    is_error: true,
    result: {
      error: 'I am an error',
    },
  };
  const component = await render(<ContractMethodResultApi item={ item } onSettle={ onSettle } result={ result }/>);

  await expect(component).toHaveScreenshot();
});

test('error with code', async({ render }) => {
  const result: FormSubmitResultApi['result'] = {
    is_error: true,
    result: {
      message: 'I am an error',
      code: -32017,
    },
  };
  const component = await render(<ContractMethodResultApi item={ item } onSettle={ onSettle } result={ result }/>);

  await expect(component).toHaveScreenshot();
});

test('raw error', async({ render }) => {
  const result: FormSubmitResultApi['result'] = {
    is_error: true,
    result: {
      raw: '49276d20616c7761797320726576657274696e67207769746820616e206572726f72',
    },
  };
  const component = await render(<ContractMethodResultApi item={ item } onSettle={ onSettle } result={ result }/>);

  await expect(component).toHaveScreenshot();
});

test('complex error', async({ render }) => {
  const result: FormSubmitResultApi['result'] = {
    is_error: true,
    result: {
      method_call: 'SomeCustomError(address addr, uint256 balance)',
      method_id: '50289a9f',
      parameters: [
        { name: 'addr', type: 'address', value: '0x850e73b42f48e91ebaedf8f00a74f6147e485c5a' },
        { name: 'balance', type: 'uint256', value: '14' },
      ],
    },
  };
  const component = await render(<ContractMethodResultApi item={ item } onSettle={ onSettle } result={ result }/>);

  await expect(component).toHaveScreenshot();
});

test('success', async({ render }) => {
  const result: FormSubmitResultApi['result'] = {
    is_error: false,
    result: {
      names: [ 'address' ],
      output: [ { type: 'address', value: '0x0000000000000000000000000000000000000000' } ],
    },
  };
  const component = await render(<ContractMethodResultApi item={ item } onSettle={ onSettle } result={ result }/>);

  await expect(component).toHaveScreenshot();
});

test('complex success', async({ render }) => {
  const result: FormSubmitResultApi['result'] = {
    is_error: false,
    result: {
      names: [
        [
          'data',
          [ 'totalSupply', 'owner', 'symbol' ],
        ],
        'supports721',
        'page',
      ],
      output: [
        {
          type: 'tuple[uint256,address,string]',
          value: [ 1000, '0xe150519ae293922cfe6217feba3add4726f5e851', 'AOC_INCUBATORS' ],
        },
        { type: 'bool', value: 'true' },
        { type: 'uint256[]', value: [ 1, 2, 3, 4, 5 ] },
      ],
    },
  };
  const component = await render(<ContractMethodResultApi item={ item } onSettle={ onSettle } result={ result }/>);

  await expect(component).toHaveScreenshot();
});
