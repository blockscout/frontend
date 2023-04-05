// import { Icon } from '@chakra-ui/react';
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

// import plusIcon from 'icons/plus.svg';
import * as textAdMock from 'mocks/ad/textAd';
import TestApp from 'playwright/TestApp';

import PageTitle from './PageTitle';

test.beforeEach(async({ page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(textAdMock.duck),
  }));
  await page.route(textAdMock.duck.ad.thumbnail, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/image_s.jpg',
    });
  });
});

test('default view +@mobile', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <PageTitle
        text="Title"
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('with text ad, back link and addons +@mobile +@dark-mode', async({ mount }) => {
  // https://github.com/microsoft/playwright/issues/15620
  // not possible to pass component as a prop in tests
  // const left = <Icon as={ plusIcon }/>;

  const component = await mount(
    <TestApp>
      <PageTitle
        text="Title"
        withTextAd
        backLink={{ label: 'Back', url: 'back' }}
        // additionalsLeft={ left }
        additionalsRight="Privet"
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('long title with text ad, back link and addons +@mobile', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <PageTitle
        text="This title is long, really long"
        withTextAd
        backLink={{ label: 'Back', url: 'back' }}
        additionalsRight="Privet, kak dela?"
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
