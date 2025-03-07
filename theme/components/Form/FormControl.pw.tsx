import { FormControl, Input, FormLabel } from '@chakra-ui/react';
import React from 'react';

import { test, expect } from 'playwright/lib';

test.use({ viewport: { width: 500, height: 300 } });

test.describe('floating label size md +@dark-mode', () => {
  test('empty', async({ render }) => {
    const component = await render(
      <FormControl variant="floating" id="name" isRequired size="md">
        <Input required value=""/>
        <FormLabel>Smart contract / Address (0x...)</FormLabel>
      </FormControl>,
    );

    await expect(component).toHaveScreenshot();

    await component.locator('input').focus();
    await expect(component).toHaveScreenshot();
  });

  test('empty error', async({ render }) => {
    const component = await render(
      <FormControl variant="floating" id="name" isRequired size="md">
        <Input required value="" isInvalid/>
        <FormLabel>Smart contract / Address (0x...)</FormLabel>
      </FormControl>,
    );

    await expect(component).toHaveScreenshot();

    await component.locator('input').focus();
    await expect(component).toHaveScreenshot();
  });

  test('filled', async({ render }) => {
    const component = await render(
      <FormControl variant="floating" id="name" isRequired size="md">
        <Input required value="foo"/>
        <FormLabel>Smart contract / Address (0x...)</FormLabel>
      </FormControl>,
    );

    await expect(component).toHaveScreenshot();
  });

  test('filled disabled', async({ render }) => {
    const component = await render(
      <FormControl variant="floating" id="name" isRequired size="md">
        <Input required value="foo" isDisabled/>
        <FormLabel>Smart contract / Address (0x...)</FormLabel>
      </FormControl>,
    );

    await expect(component).toHaveScreenshot();
  });

  test('filled read-only', async({ render }) => {
    const component = await render(
      <FormControl variant="floating" id="name" isRequired size="md">
        <Input required value="foo" isReadOnly/>
        <FormLabel>Smart contract / Address (0x...)</FormLabel>
      </FormControl>,
    );

    await expect(component).toHaveScreenshot();
  });

  test('filled error', async({ render }) => {
    const component = await render(
      <FormControl variant="floating" id="name" isRequired size="md">
        <Input required value="foo" isInvalid/>
        <FormLabel>Smart contract / Address (0x...)</FormLabel>
      </FormControl>,
    );

    await expect(component).toHaveScreenshot();
  });
});

test.describe('floating label size lg +@dark-mode', () => {
  test('empty', async({ render }) => {
    const component = await render(
      <FormControl variant="floating" id="name" isRequired size="lg">
        <Input required value=""/>
        <FormLabel>Smart contract / Address (0x...)</FormLabel>
      </FormControl>,
    );

    await expect(component).toHaveScreenshot();

    await component.locator('input').focus();
    await expect(component).toHaveScreenshot();
  });

  test('filled', async({ render }) => {
    const component = await render(
      <FormControl variant="floating" id="name" isRequired size="lg">
        <Input required value="foo"/>
        <FormLabel>Smart contract / Address (0x...)</FormLabel>
      </FormControl>,
    );

    await expect(component).toHaveScreenshot();

    await component.locator('input').focus();
    await expect(component).toHaveScreenshot();
  });
});
