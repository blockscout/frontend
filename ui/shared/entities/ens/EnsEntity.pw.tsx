import React from 'react';

import * as domainMock from 'mocks/ens/domain';
import { test, expect } from 'playwright/lib';

import EnsEntity from './EnsEntity';

const name = 'cat.eth';
const iconSizes = [ 'md', 'lg' ];

test.use({ viewport: { width: 180, height: 30 } });

test.describe('icon size', () => {
  iconSizes.forEach((size) => {
    test(size, async({ render }) => {
      const component = await render(
        <EnsEntity
          name={ name }
          iconSize={ size }
        />,
      );

      await expect(component).toHaveScreenshot();
    });
  });
});

test('loading', async({ render }) => {
  const component = await render(
    <EnsEntity
      name={ name }
      isLoading
    />,
  );

  await expect(component).toHaveScreenshot();
});

test('with long name', async({ render }) => {
  const component = await render(
    <EnsEntity
      name="kitty.kitty.kitty.cat.eth"
    />,
  );

  await component.getByText(name.slice(0, 4)).hover();

  await expect(component).toHaveScreenshot();
});

test('customization', async({ render }) => {
  const component = await render(
    <EnsEntity
      name={ name }
      p={ 3 }
      borderWidth="1px"
      borderColor="blue.700"
    />,
  );

  await expect(component).toHaveScreenshot();
});

test.describe('', () => {
  test.use({ viewport: { width: 300, height: 400 } });
  test('with protocol info', async({ render, page, mockAssetResponse }) => {
    await mockAssetResponse(domainMock.ensDomainA.protocol?.icon_url as string, './playwright/mocks/image_s.jpg');

    const component = await render(
      <EnsEntity
        name={ name }
        protocol={ domainMock.protocolA }
      />,
    );

    await component.getByAltText(`${ domainMock.protocolA.title } protocol icon`).first().hover();

    await expect(page.getByText(domainMock.protocolA.description)).toBeVisible();
    await expect(page).toHaveScreenshot();
  });
});
