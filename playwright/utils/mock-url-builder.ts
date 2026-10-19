import type { ExternalChainExtended } from 'src/shared/external-chains/types';

import type { ResourceName } from 'src/api/resources';
import type buildUrl from 'src/api/utils/build-url';

export type MockUrlQueryParams = NonNullable<Parameters<typeof buildUrl>[2]>;

// Plain data: these cross the page.evaluate boundary, so they carry no generic resource typing.
export interface MockApiUrlArgs {
  resourceName: ResourceName;
  pathParams?: Record<string, string | undefined>;
  queryParams?: MockUrlQueryParams;
  chainConfig?: ExternalChainExtended;
}

export interface MockUrlBuilder {
  api: (args: MockApiUrlArgs) => Promise<string>;
  configAsset: (envName: string, envValue: string) => Promise<string>;
}
