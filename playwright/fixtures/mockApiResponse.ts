import type { TestFixture, Page } from '@playwright/test';

import type { ExternalChainExtended } from 'src/shared/external-chains/types';

import type { ResourceName, ResourcePathParams, ResourcePayload } from 'src/api/resources';

import type { MockApiUrlArgs, MockUrlQueryParams } from '../utils/mock-url-builder';
import type { MockRegistryFixture } from './mockRegistry';

interface Options<R extends ResourceName> {
  pathParams?: ResourcePathParams<R>;
  queryParams?: MockUrlQueryParams;
  chainConfig?: ExternalChainExtended;
  times?: number;
  status?: number;
}

export type MockApiResponseFixture = <R extends ResourceName>(resourceName: R, responseMock: ResourcePayload<R>, options?: Options<R>) => Promise<string>;

const fixture: TestFixture<MockApiResponseFixture, { page: Page; mockRegistry: MockRegistryFixture }> = async({ page, mockRegistry }, use) => {
  await use(async(resourceName, responseMock, options) => {
    // Resolved in the page, not in Node: the browser config honours the localStorage overrides
    // written by mockEnvs, so the matcher equals the URL the component will request.
    const args: MockApiUrlArgs = {
      resourceName,
      pathParams: options?.pathParams,
      queryParams: options?.queryParams,
      chainConfig: options?.chainConfig,
    };
    const apiUrl = await page.evaluate((args) => window.__mockUrlBuilder.api(args), args);

    mockRegistry.registrations.push({ fixture: 'mockApiResponse', url: apiUrl });

    await page.route(apiUrl, (route) => route.fulfill({
      status: options?.status ?? 200,
      json: responseMock,
    }), { times: options?.times });

    return apiUrl;
  });
};

export default fixture;
