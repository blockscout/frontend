import type { ExternalChainExtended } from 'src/shared/external-chains/types';

import type { ResourceName } from 'src/api/resources';

export type MockUrlQueryParams = Record<string, string | Array<string> | number | boolean | null | undefined>;

// Plain data: these cross the page.evaluate boundary, so they carry no generic resource typing.
export interface MockApiUrlArgs {
  resourceName: ResourceName;
  pathParams?: Record<string, string | undefined>;
  queryParams?: MockUrlQueryParams;
  chainConfig?: ExternalChainExtended;
}

/**
 * Builds the URLs the mock fixtures match against, inside the test page, with the production URL
 * builders. Exposed by the harness entry as `window.__mockUrlBuilder`.
 */
export interface MockUrlBuilder {
  api: (args: MockApiUrlArgs) => Promise<string>;
  configAsset: (envName: string, envValue: string) => Promise<string>;
}
