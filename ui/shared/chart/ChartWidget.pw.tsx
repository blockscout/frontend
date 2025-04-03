import React from 'react';

import type { TimeChartItem } from './types';

import { test, expect } from 'playwright/lib';

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
  noAnimation: true,
};

test('base view +@dark-mode', async({ render, page }) => {
  const component = await render(<ChartWidget { ...props }/>);

  await page.waitForFunction(() => {
    return document.querySelector('path[data-name="chart-Nativecoincirculatingsupply-small"]')?.getAttribute('opacity') === '1';
  });
  await expect(component).toHaveScreenshot();

  await component.getByLabel('Open chart options menu').click();
  await expect(component).toHaveScreenshot();

  await page.mouse.move(0, 0);
  await page.mouse.click(0, 0);
  await page.mouse.move(80, 150);
  await page.mouse.move(100, 150);
  await expect(component).toHaveScreenshot();

  await page.mouse.down();
  await page.mouse.move(300, 150);
  await page.mouse.up();
  await expect(component).toHaveScreenshot();
});

test('loading', async({ render }) => {
  const component = await render(<ChartWidget { ...props } isLoading minH="250px"/>);
  await expect(component).toHaveScreenshot();
});

test('error', async({ render }) => {
  const component = await render(<ChartWidget { ...props } isError/>);
  await expect(component).toHaveScreenshot();
});

test('small values', async({ render, page }) => {
  const modifiedProps = {
    ...props,
    items: [
      { date: new Date('2023-02-13'), value: 0.000005041012112611958 },
      { date: new Date('2023-02-14'), value: 0.000004781545670577531 },
      { date: new Date('2023-02-15'), value: 0.00000520510604212437 },
      { date: new Date('2023-02-16'), value: 0.000005274901030625893 },
      { date: new Date('2023-02-17'), value: 0.00000534325322320271 },
      { date: new Date('2023-02-18'), value: 0.00000579140116207668 },
      { date: new Date('2023-02-19'), value: 0.000004878307079043056 },
      { date: new Date('2023-02-20'), value: 0.0000053454186920910215 },
      { date: new Date('2023-02-21'), value: 0.000005770588532081243 },
      { date: new Date('2023-02-22'), value: 0.00000589334810122426 },
      { date: new Date('2023-02-23'), value: 0.00000547040196358741 },
    ],
  };

  const component = await render(<ChartWidget { ...modifiedProps }/>);
  await page.waitForFunction(() => {
    return document.querySelector('path[data-name="chart-Nativecoincirculatingsupply-small"]')?.getAttribute('opacity') === '1';
  });
  await expect(component).toHaveScreenshot();
});

test('small variations in big values', async({ render, page }) => {
  const modifiedProps = {
    ...props,
    items: [
      { date: new Date('2023-02-13'), value: 8886203 },
      { date: new Date('2023-02-14'), value: 8890184 },
      { date: new Date('2023-02-15'), value: 8893483 },
      { date: new Date('2023-02-16'), value: 8897924 },
      { date: new Date('2023-02-17'), value: 8902268 },
      { date: new Date('2023-02-18'), value: 8906320 },
      { date: new Date('2023-02-19'), value: 8910264 },
      { date: new Date('2023-02-20'), value: 8914827 },
      { date: new Date('2023-02-21'), value: 8918592 },
      { date: new Date('2023-02-22'), value: 8921988 },
      { date: new Date('2023-02-23'), value: 8922206 },
    ],
  };

  const component = await render(<ChartWidget { ...modifiedProps }/>);
  await page.waitForFunction(() => {
    return document.querySelector('path[data-name="chart-Nativecoincirculatingsupply-small"]')?.getAttribute('opacity') === '1';
  });
  await expect(component).toHaveScreenshot();
});

test('incomplete day', async({ render, page }) => {
  const modifiedProps = {
    ...props,
    items: [
      ...props.items as Array<TimeChartItem>,
      { date: new Date('2023-02-24'), value: 25136740.887217894 / 4, isApproximate: true },
    ],
  };

  const component = await render(<ChartWidget { ...modifiedProps }/>);
  await page.waitForFunction(() => {
    return document.querySelector('path[data-name="chart-Nativecoincirculatingsupply-small"]')?.getAttribute('opacity') === '1';
  });
  await expect(component).toHaveScreenshot();

  await page.hover('.ChartOverlay', { position: { x: 120, y: 120 } });
  await page.hover('.ChartOverlay', { position: { x: 320, y: 120 } });
  await expect(page.getByText('Incomplete day')).toBeVisible();
  await expect(component).toHaveScreenshot();
});
