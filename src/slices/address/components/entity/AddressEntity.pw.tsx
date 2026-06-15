import { Box } from '@chakra-ui/react';
import type { BrowserContext } from '@playwright/test';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';
import * as addressParamMock from 'src/slices/address/mocks/address-param';
import * as implementationsMock from 'src/slices/address/mocks/implementations';

import * as metadataMock from 'src/features/address-metadata/mocks/tags';

import config from 'src/config';
import * as cookies from 'src/shared/storage/cookies';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import AddressEntity from './AddressEntity';

const variants = [ 'subheading', 'content' ] as const;

test.use({ viewport: { width: 180, height: 140 } });

test.describe('variant', () => {
  variants.forEach((variant) => {
    test(`${ variant }`, async({ render }) => {
      const component = await render(
        <AddressEntity
          address={ addressParamMock.withoutName }
          variant={ variant }
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
        address={{ ...addressParamMock.contract, is_verified: false, implementations: [] }}
      />,
    );

    await component.getByText(/eternal/i).hover();
    await page.locator('div').filter({ hasText: 'EternalStorageProxy' }).first().waitFor({ state: 'visible' });
    await expect(page).toHaveScreenshot();
  });

  test('verified', async({ render }) => {
    const component = await render(
      <AddressEntity
        address={{ ...addressParamMock.contract, is_verified: true, implementations: [] }}
      />,
    );

    await expect(component).toHaveScreenshot();
  });
});

test.describe('shield', () => {
  const ICON_URL = 'https://images.com/icons/shield.png';
  test.use({ viewport: { width: 500, height: 200 } });

  test('regular address with image', async({ render, page, mockAssetResponse }) => {
    await mockAssetResponse(ICON_URL, './playwright/mocks/image_svg.svg');

    await render(
      <AddressEntity
        address={{ ...addressParamMock.withoutName }}
        icon={{
          shield: { src: ICON_URL },
          hint: 'Address on TON',
        }}
      />,
    );
    await page.locator('img').first().hover();
    await page.locator('div').filter({ hasText: 'Address on TON' }).first().waitFor({ state: 'visible' });

    await expect(page).toHaveScreenshot();
  });

  test('contract with icon', async({ render, page }) => {
    await render(
      <AddressEntity
        address={{ ...addressParamMock.contract, is_verified: true, implementations: [] }}
        icon={{
          shield: { name: 'brands/ton' },
          hint: 'Address on TON',
          hintPostfix: ' on TON',
        }}
      />,
    );
    await page.getByRole('img').first().hover();
    await page.locator('div').filter({ hasText: 'Verified contract on TON' }).first().waitFor({ state: 'visible' });

    await expect(page).toHaveScreenshot();
  });
});

test.describe('proxy contract', () => {
  test.use({ viewport: { width: 500, height: 300 } });

  test('with implementation name', async({ render, page }) => {
    const component = await render(
      <AddressEntity
        address={ addressParamMock.contract }
      />,
    );

    await component.getByText(/home/i).hover();
    await page.getByText(/implementation/i).waitFor({ state: 'visible' });
    await expect(page).toHaveScreenshot();
  });

  test('without implementation name', async({ render, page }) => {
    const component = await render(
      <AddressEntity
        address={{
          ...addressParamMock.contract,
          implementations: [ { address_hash: addressParamMock.contract.implementations?.[0].address_hash as string, name: null } ],
        }}
      />,
    );

    await component.getByText(/eternal/i).hover();
    await page.getByText(/implementation/i).waitFor({ state: 'visible' });
    await expect(page).toHaveScreenshot();
  });

  test('without any name', async({ render, page }) => {
    const component = await render(
      <AddressEntity
        address={{
          ...addressParamMock.contract,
          name: undefined,
          implementations: [ { address_hash: addressParamMock.contract.implementations?.[0].address_hash as string, name: null } ],
        }}
      />,
    );

    await component.getByText(addressParamMock.contract.hash.slice(0, 4)).hover();
    await page.getByText(/implementation/i).waitFor({ state: 'visible' });
    await expect(page).toHaveScreenshot();
  });

  test('with multiple implementations', async({ render, page }) => {
    const component = await render(
      <AddressEntity
        address={{ ...addressParamMock.contract, implementations: implementationsMock.multiple }}
      />,
    );

    await component.getByText(/eternal/i).hover();
    await page.getByText(/implementation/i).waitFor({ state: 'visible' });
    await expect(page).toHaveScreenshot();
  });

  test('with name tag', async({ render, page }) => {
    const component = await render(
      <AddressEntity
        address={{ ...addressParamMock.contract, metadata: { tags: [ metadataMock.nameTag ] } }}
      />,
    );

    await component.getByText(/quack/i).hover();
    await page.getByText(/implementation/i).waitFor({ state: 'visible' });
    await expect(page).toHaveScreenshot();
  });
});

test.describe('loading', () => {
  test('without alias', async({ render }) => {
    const component = await render(
      <AddressEntity
        address={ addressParamMock.withoutName }
        isLoading
      />,
    );

    await expect(component).toHaveScreenshot();
  });

  test('with alias', async({ render }) => {
    const component = await render(
      <AddressEntity
        address={ addressParamMock.withName }
        isLoading
      />,
    );

    await expect(component).toHaveScreenshot();
  });

});

test('with ENS', async({ render }) => {
  const component = await render(
    <AddressEntity
      address={ addressParamMock.withEns }
    />,
  );

  await expect(component).toHaveScreenshot();
});

test('delegated address +@dark-mode', async({ render }) => {
  const component = await render(
    <AddressEntity
      address={ addressParamMock.delegated }
    />,
  );

  await expect(component).toHaveScreenshot();
});

test('with name tag', async({ render }) => {
  const component = await render(
    <AddressEntity
      address={ addressParamMock.withNameTag }
    />,
  );

  await expect(component).toHaveScreenshot();
});

test.describe('with cex deposit tag', () => {
  test.use({ viewport: { width: 500, height: 140 } });

  test('default', async({ render }) => {
    const address: schemas['Address'] = { ...addressParamMock.withNameTag, metadata: { tags: [ metadataMock.cexDepositTag ] } };

    const component = await render(
      <AddressEntity
        address={ address }
      />,
    );

    await expect(component).toHaveScreenshot();
  });
});

test('external link', async({ render }) => {
  const component = await render(
    <AddressEntity
      address={ addressParamMock.withoutName }
      link={{ external: true }}
    />,
  );

  await expect(component).toHaveScreenshot();
});

test('no link', async({ render }) => {
  const component = await render(
    <AddressEntity
      address={ addressParamMock.withoutName }
      noLink
    />,
  );

  await expect(component).toHaveScreenshot();
});

test('customization', async({ render }) => {
  const component = await render(
    <AddressEntity
      address={ addressParamMock.withoutName }
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
          address={ addressParamMock.withoutName }
        />
      </Box>
    </AddressHighlightProvider>,
  );

  await component.getByText(addressParamMock.hash.slice(0, 4)).hover();
  await page.getByText(addressParamMock.hash).waitFor({ state: 'visible' });
  await expect(page).toHaveScreenshot();
});

const bech32test = test.extend<{ context: BrowserContext }>({
  context: async({ context }, use) => {
    context.addCookies([ { name: cookies.NAMES.ADDRESS_FORMAT, value: 'bech32', domain: config.app.host, path: '/' } ]);
    use(context);
  },
});

bech32test('bech32 format', async({ render, mockEnvs }) => {
  await mockEnvs(ENVS_MAP.addressBech32Format);
  const component = await render(
    <AddressEntity
      address={ addressParamMock.withoutName }
    />,
  );

  await expect(component).toHaveScreenshot();
});
