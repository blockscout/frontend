import React from 'react';

import { campNetworkCluster, duckCluster, testnetCluster, longNameCluster } from 'mocks/clusters/directory';
import { test, expect } from 'playwright/lib';

import ClustersEntity from './ClustersEntity';

test.describe('ClustersEntity Component', () => {
  test('basic cluster entity display +@mobile', async({ render }) => {
    const component = await render(
      <ClustersEntity
        clusterName="example.cluster"
      />,
    );

    await expect(component.getByText('example.cluster/')).toBeVisible();

    await expect(component).toHaveScreenshot();
  });

  test('cluster with subdomain display +@mobile', async({ render }) => {
    const component = await render(
      <ClustersEntity
        clusterName="test/subdomain"
      />,
    );

    await expect(component.getByText('test/subdomain')).toBeVisible();

    await expect(component).toHaveScreenshot();
  });

  test('real campnetwork cluster data +@mobile', async({ render }) => {
    const component = await render(
      <ClustersEntity
        clusterName={ campNetworkCluster.name }
        href={ `/cluster/${ campNetworkCluster.name }` }
      />,
    );

    await expect(component.getByText('campnetwork/lol')).toBeVisible();

    await expect(component).toHaveScreenshot();
  });

  test('real duck cluster data +@mobile', async({ render }) => {
    const component = await render(
      <ClustersEntity
        clusterName={ duckCluster.name }
        href={ `/cluster/${ duckCluster.name }` }
      />,
    );

    await expect(component.getByText('duck/quack')).toBeVisible();

    await expect(component).toHaveScreenshot();
  });

  test('testnet cluster display +@mobile', async({ render }) => {
    const component = await render(
      <ClustersEntity
        clusterName={ testnetCluster.name }
        href={ `/cluster/${ testnetCluster.name }` }
      />,
    );

    await expect(component.getByText('test/cluster')).toBeVisible();

    await expect(component).toHaveScreenshot();
  });

  test('loading state +@mobile', async({ render }) => {
    const component = await render(
      <ClustersEntity
        clusterName="loading.cluster"
        isLoading={ true }
      />,
    );

    await expect(component).toHaveScreenshot();
  });

  test('long cluster name truncation +@mobile', async({ render }) => {
    const component = await render(
      <ClustersEntity
        clusterName={ longNameCluster.name }
        href={ `/cluster/${ longNameCluster.name }` }
      />,
    );

    await expect(component.getByText(/this-is-a-very-long/)).toBeVisible();

    await expect(component).toHaveScreenshot();
  });

  test('cluster entity with no link +@mobile', async({ render }) => {
    const component = await render(
      <ClustersEntity
        clusterName="example.cluster"
        noLink={ true }
      />,
    );

    await expect(component.getByText('example.cluster/')).toBeVisible();

    await expect(component).toHaveScreenshot();
  });

  test('cluster entity with no icon +@mobile', async({ render }) => {
    const component = await render(
      <ClustersEntity
        clusterName="example.cluster"
        noIcon={ true }
      />,
    );

    await expect(component.getByText('example.cluster/')).toBeVisible();

    await expect(component).toHaveScreenshot();
  });

  test('heading variant +@mobile', async({ render }) => {
    const component = await render(
      <ClustersEntity
        clusterName="example.cluster"
        variant="heading"
      />,
    );

    await expect(component).toHaveScreenshot();
  });

  test('subheading variant +@mobile', async({ render }) => {
    const component = await render(
      <ClustersEntity
        clusterName="example.cluster"
        variant="subheading"
      />,
    );

    await expect(component).toHaveScreenshot();
  });

  test('hover interaction +@mobile', async({ render }) => {
    const component = await render(
      <ClustersEntity
        clusterName="example.cluster"
      />,
    );

    await component.hover();

    await expect(component).toHaveScreenshot();
  });

  test('dark mode display +@dark-mode', async({ render }) => {
    const component = await render(
      <ClustersEntity
        clusterName="example.cluster"
      />,
    );

    await expect(component).toHaveScreenshot();
  });

});
