import type { TestFixture, Page } from '@playwright/test';

import buildUrl from 'lib/api/buildUrl';
import type { ResourceName, ResourcePayload } from 'lib/api/resources';

interface ResourceInfo<R extends ResourceName> {
  resourceName: Parameters<typeof buildUrl<R>>[0];
  pathParams?: Parameters<typeof buildUrl<R>>[1];
  queryParams?: Parameters<typeof buildUrl<R>>[2];
}

export type MockApiResponseFixture = <R extends ResourceName>(resourceInfo: ResourceInfo<R>, responseMock: ResourcePayload<R>) => Promise<string>;

const fixture: TestFixture<MockApiResponseFixture, { page: Page }> = async({ page }, use) => {
  await use(async<R extends ResourceName>(resourceInfo: ResourceInfo<R>, responseMock: ResourcePayload<R>) => {
    const url = buildUrl(resourceInfo.resourceName, resourceInfo.pathParams, resourceInfo.queryParams);

    await page.route(url, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(responseMock),
    }));

    return url;
  });
};

export default fixture;
