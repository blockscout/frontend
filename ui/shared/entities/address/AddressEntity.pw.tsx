import { Box } from '@chakra-ui/react';
import React from 'react';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import * as addressMock from 'mocks/address/address';
import * as implementationsMock from 'mocks/address/implementations';
import * as metadataMock from 'mocks/metadata/address';
import { test, expect } from 'playwright/lib';

import AddressEntity from './AddressEntity';

const iconSizes = [ 'md', 'lg' ] as const;

test.use({ viewport: { width: 180, height: 140 } });

test.describe('icon size', () => {
  iconSizes.forEach((size) => {
    test(size, async({ render }) => {
      const component = await render(
        <AddressEntity
          address={ addressMock.withoutName }
          icon={{ size }}
        />,
      );

      await expect(component).toHaveScreenshot();
    });
  });
});

test.describe('contract', () => {
  test('unverified', async({ render, page }) => {
    const component = await render(
      <AddressEntity
        address={{ ...addressMock.contract, is_verified: false, implementations: null }}
      />,
    );

    await component.getByText(/eternal/i).hover();
    await expect(page).toHaveScreenshot();
  });

  test('verified', async({ render }) => {
    const component = await render(
      <AddressEntity
        address={{ ...addressMock.contract, is_verified: true, implementations: null }}
      />,
    );

    await expect(component).toHaveScreenshot();
  });
});

test.describe('proxy contract', () => {
  test.use({ viewport: { width: 500, height: 300 } });

  test('with implementation name', async({ render, page }) => {
    const component = await render(
      <AddressEntity
        address={ addressMock.contract }
      />,
    );

    await component.getByText(/home/i).hover();
    await expect(page.getByText('Proxy contract')).toBeVisible();
    await expect(page).toHaveScreenshot();
  });

  test('without implementation name', async({ render, page }) => {
    const component = await render(
      <AddressEntity
        address={{ ...addressMock.contract, implementations: [ { address: addressMock.contract.implementations?.[0].address as string } ] }}
      />,
    );

    await component.getByText(/eternal/i).hover();
    await expect(page.getByText('Proxy contract')).toBeVisible();
    await expect(page).toHaveScreenshot();
  });

  test('without any name', async({ render, page }) => {
    const component = await render(
      <AddressEntity
        address={{ ...addressMock.contract, name: undefined, implementations: [ { address: addressMock.contract.implementations?.[0].address as string } ] }}
      />,
    );

    await component.getByText(addressMock.contract.hash.slice(0, 4)).hover();
    await expect(page.getByText('Proxy contract')).toBeVisible();
    await expect(page).toHaveScreenshot();
  });

  test('with multiple implementations', async({ render, page }) => {
    const component = await render(
      <AddressEntity
        address={{ ...addressMock.contract, implementations: implementationsMock.multiple }}
      />,
    );

    await component.getByText(/eternal/i).hover();
    await expect(page.getByText('Proxy contract')).toBeVisible();
    await expect(page).toHaveScreenshot();
  });

  test('with name tag', async({ render, page }) => {
    const component = await render(
      <AddressEntity
        address={{ ...addressMock.contract, metadata: { reputation: 1, tags: [ metadataMock.nameTag ] } }}
      />,
    );

    await component.getByText(/quack/i).hover();
    await expect(page.getByText('Proxy contract')).toBeVisible();
    await expect(page).toHaveScreenshot();
  });
});

test.describe('loading', () => {
  test('without alias', async({ render }) => {
    const component = await render(
      <AddressEntity
        address={ addressMock.withoutName }
        isLoading
      />,
    );

    await expect(component).toHaveScreenshot();
  });

  test('with alias', async({ render }) => {
    const component = await render(
      <AddressEntity
        address={ addressMock.withName }
        isLoading
      />,
    );

    await expect(component).toHaveScreenshot();
  });

});

test('with ENS', async({ render }) => {
  const component = await render(
    <AddressEntity
      address={ addressMock.withEns }
    />,
  );

  await expect(component).toHaveScreenshot();
});

test('with name tag', async({ render }) => {
  const component = await render(
    <AddressEntity
      address={ addressMock.withNameTag }
    />,
  );

  await expect(component).toHaveScreenshot();
});

test('external link', async({ render }) => {
  const component = await render(
    <AddressEntity
      address={ addressMock.withoutName }
      isExternal
    />,
  );

  await expect(component).toHaveScreenshot();
});

test('no link', async({ render }) => {
  const component = await render(
    <AddressEntity
      address={ addressMock.withoutName }
      noLink
    />,
  );

  await expect(component).toHaveScreenshot();
});

test('customization', async({ render }) => {
  const component = await render(
    <AddressEntity
      address={ addressMock.withoutName }
      truncation="constant"
      p={ 3 }
      borderWidth="1px"
      borderColor="blue.700"
    />,
  );

  await expect(component).toHaveScreenshot();
});

test('hover', async({ page, render }) => {
  const component = await render(
    <AddressHighlightProvider>
      <Box p={ 3 }>
        <AddressEntity
          address={ addressMock.withoutName }
        />
      </Box>
    </AddressHighlightProvider>,
  );

  await component.getByText(addressMock.hash.slice(0, 4)).hover();
  await expect(page).toHaveScreenshot();
});
