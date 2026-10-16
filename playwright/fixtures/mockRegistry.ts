import type { TestFixture } from '@playwright/test';

export interface MockRegistration {
  fixture: 'mockApiResponse' | 'mockConfigResponse';
  url: string;
}

export interface MockRegistryFixture {
  registrations: Array<MockRegistration>;
  unmockedUrls: Array<string>;
}

// Test-scoped state shared by the mock fixtures, mockEnvs and the catch-all route in lib.ts. The first
// mock registration resolves its URL in the page, which evaluates the browser config singleton with
// whatever envs are in localStorage at that moment, so mockEnvs uses the list to refuse to run after
// one; the afterEach check reads both lists to name a request no matcher handled.
// eslint-disable-next-line no-empty-pattern -- Playwright fixtures must destructure their (here empty) dependencies
const fixture: TestFixture<MockRegistryFixture, object> = async({}, use) => {
  await use({ registrations: [], unmockedUrls: [] });
};

export default fixture;
