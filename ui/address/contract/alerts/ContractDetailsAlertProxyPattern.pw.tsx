import React from 'react';

import { test, expect } from 'playwright/lib';

import ContractDetailsAlertProxyPattern from './ContractDetailsAlertProxyPattern';

test('proxy type with link +@mobile', async({ render }) => {
  const component = await render(<ContractDetailsAlertProxyPattern type="eip1167"/>);
  await expect(component).toHaveScreenshot();
});

test('proxy type with link but without description', async({ render }) => {
  const component = await render(<ContractDetailsAlertProxyPattern type="master_copy"/>);
  await expect(component).toHaveScreenshot();
});

test('proxy type without link', async({ render }) => {
  const component = await render(<ContractDetailsAlertProxyPattern type="basic_implementation"/>);
  await expect(component).toHaveScreenshot();
});
