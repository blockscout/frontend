import type { TestFixture } from '@playwright/test';

export interface MockRegistration {
  fixture: 'mockApiResponse' | 'mockConfigResponse';
  url: string;
}

export interface MockRegistryFixture {
  registrations: Array<MockRegistration>;
}

// Test-scoped state shared by the mock fixtures and mockEnvs. The first mock registration resolves
// its URL in the page, which evaluates the browser config singleton with whatever envs are in
// localStorage at that moment, so mockEnvs uses this list to refuse to run after one.
// eslint-disable-next-line no-empty-pattern -- Playwright fixtures must destructure their (here empty) dependencies
const fixture: TestFixture<MockRegistryFixture, object> = async({}, use) => {
  await use({ registrations: [] });
};

export default fixture;
