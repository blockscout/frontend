import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import type { Props } from './ChartWidget';
import ChartWidget from './ChartWidget';

test.use({ viewport: { width: 400, height: 300 } });

const props: Props = {
  items: [
    { date: new Date('2023-02-13'), value: 1.7631568828337087 },
    { date: new Date('2023-02-14'), value: 9547912.248607066 },
    { date: new Date('2023-02-15'), value: 19795391.669569757 },
    { date: new Date('2023-02-16'), value: 18338481.6037719 },
    { date: new Date('2023-02-17'), value: 18716729.946751505 },
    { date: new Date('2023-02-18'), value: 32164355.603443976 },
    { date: new Date('2023-02-19'), value: 20856850.45498412 },
    { date: new Date('2023-02-20'), value: 18846303.416569296 },
    { date: new Date('2023-02-21'), value: 26366091.117737416 },
    { date: new Date('2023-02-22'), value: 30446292.68212635 },
    { date: new Date('2023-02-23'), value: 25136740.887217894 },
  ],
  title: 'Native coin circulating supply',
  description: 'Amount of token circulating supply for the period',
  units: 'ETH',
  isLoading: false,
  isError: false,
};

test('base view +@dark-mode', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <ChartWidget { ...props }/>
    </TestApp>,
  );
  await page.waitForFunction(() => {
    return document.querySelector('path[data-name="chart-Nativecoincirculatingsupply-small"]')?.getAttribute('opacity') === '1';
  });
  await expect(component).toHaveScreenshot();

  await component.locator('.chakra-menu__menu-button').click();
  await expect(component).toHaveScreenshot();

  await page.mouse.move(0, 0);
  await page.mouse.click(0, 0);
  await page.mouse.move(100, 150);
  await expect(component).toHaveScreenshot();

  await page.mouse.down();
  await page.mouse.move(300, 150);
  await page.mouse.up();
  await expect(component).toHaveScreenshot();
});

test('loading', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <ChartWidget { ...props } isLoading minH="250px"/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('error', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <ChartWidget { ...props } isError/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
