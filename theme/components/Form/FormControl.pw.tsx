import { FormControl, Input, FormLabel } from '@chakra-ui/react';
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

test.use({ viewport: { width: 500, height: 300 } });

test.describe('floating label size md +@dark-mode', () => {
  test('empty', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <FormControl variant="floating" id="name" isRequired size="md">
          <Input required value=""/>
          <FormLabel>Smart contract / Address (0x...)</FormLabel>
        </FormControl>
      </TestApp>,
    );

    await expect(component).toHaveScreenshot();

    await component.locator('input').focus();
    await expect(component).toHaveScreenshot();
  });

  test('empty error', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <FormControl variant="floating" id="name" isRequired size="md">
          <Input required value="" isInvalid/>
          <FormLabel>Smart contract / Address (0x...)</FormLabel>
        </FormControl>
      </TestApp>,
    );

    await expect(component).toHaveScreenshot();

    await component.locator('input').focus();
    await expect(component).toHaveScreenshot();
  });

  test('filled', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <FormControl variant="floating" id="name" isRequired size="md">
          <Input required value="foo"/>
          <FormLabel>Smart contract / Address (0x...)</FormLabel>
        </FormControl>
      </TestApp>,
    );

    await expect(component).toHaveScreenshot();
  });

  test('filled disabled', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <FormControl variant="floating" id="name" isRequired size="md">
          <Input required value="foo" isDisabled/>
          <FormLabel>Smart contract / Address (0x...)</FormLabel>
        </FormControl>
      </TestApp>,
    );

    await expect(component).toHaveScreenshot();
  });

  test('filled error', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <FormControl variant="floating" id="name" isRequired size="md">
          <Input required value="foo" isInvalid/>
          <FormLabel>Smart contract / Address (0x...)</FormLabel>
        </FormControl>
      </TestApp>,
    );

    await expect(component).toHaveScreenshot();
  });
});

test.describe('floating label size lg +@dark-mode', () => {
  test('empty', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <FormControl variant="floating" id="name" isRequired size="lg">
          <Input required value=""/>
          <FormLabel>Smart contract / Address (0x...)</FormLabel>
        </FormControl>
      </TestApp>,
    );

    await expect(component).toHaveScreenshot();

    await component.locator('input').focus();
    await expect(component).toHaveScreenshot();
  });

  test('filled', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <FormControl variant="floating" id="name" isRequired size="lg">
          <Input required value="foo"/>
          <FormLabel>Smart contract / Address (0x...)</FormLabel>
        </FormControl>
      </TestApp>,
    );

    await expect(component).toHaveScreenshot();

    await component.locator('input').focus();
    await expect(component).toHaveScreenshot();
  });
});
