import type { TestFixture, Page } from '@playwright/test';

import type { MockRegistryFixture } from './mockRegistry';

export type MockEnvsFixture = (envs: Array<[string, string]>) => Promise<void>;

const fixture: TestFixture<MockEnvsFixture, { page: Page; mockRegistry: MockRegistryFixture }> = async({ page, mockRegistry }, use) => {
  await use(async(envs) => {
    const [ firstRegistration ] = mockRegistry.registrations;

    if (firstRegistration) {
      throw new Error(
        `mockEnvs() was called after ${ firstRegistration.fixture }() in the same test. ` +
        'Env overrides must come first: the first mock registration resolves its URL against the app config ' +
        'in the browser, which snapshots the envs, so call mockEnvs() before any mockApiResponse() or mockConfigResponse().',
      );
    }

    for (const [ name, value ] of envs) {
      await page.evaluate(({ name, value }) => {
        window.localStorage.setItem(name, value);
      }, { name, value });
    }
  });
};

export default fixture;

export { ENVS_MAP } from 'src/config/test-utils/env-presets';
