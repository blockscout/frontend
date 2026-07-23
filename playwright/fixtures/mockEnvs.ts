import type { TestFixture, Page } from '@playwright/test';

export type MockEnvsFixture = (envs: Array<[string, string]>) => Promise<void>;

const fixture: TestFixture<MockEnvsFixture, { page: Page }> = async({ page }, use) => {
  await use(async(envs) => {
    for (const [ name, value ] of envs) {
      await page.evaluate(({ name, value }) => {
        window.localStorage.setItem(name, value);
      }, { name, value });
    }
  });
};

export default fixture;

export { ENVS_MAP } from 'src/config/test-utils/env-presets';
