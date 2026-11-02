import './fonts.css';
import './index.css';
import '../src/server/global.css';
import { beforeMount } from '@playwright/experimental-ct-react/hooks';
import MockDate from 'mockdate';
import type { NextRouter } from 'next/router';

import { setRouterMock } from './mocks/modules/next/router';
import type { MockUrlBuilder } from './utils/mock-url-builder';

beforeMount(async({ hooksConfig }: { hooksConfig?: { router?: Partial<NextRouter> } }) => {
  setRouterMock(hooksConfig?.router);

  // set current date
  MockDate.set('2022-11-11T12:00:00Z');
});

// The mock fixtures resolve their route matchers here, in the page, so that the URL reflects the
// localStorage env overrides the component itself will see. The production modules are imported
// lazily: evaluating src/config pins the env snapshot, which must not happen before mockEnvs has run.
const mockUrlBuilder: MockUrlBuilder = {
  api: async({ resourceName, pathParams, queryParams, chainConfig }) => {
    const { 'default': buildUrl } = await import('../src/api/utils/build-url');
    // pathParams arrive as plain data from page.evaluate; the fixture already typed them against the resource.
    return buildUrl(resourceName, pathParams as never, queryParams, undefined, chainConfig);
  },
  configAsset: async(envName, envValue) => {
    const [ { 'default': config }, { buildExternalAssetFilePath } ] = await Promise.all([
      import('../src/config'),
      import('../src/config/utils/envs'),
    ]);
    return config.app.baseUrl + buildExternalAssetFilePath(envName, envValue);
  },
};

window.__mockUrlBuilder = mockUrlBuilder;

export {};
