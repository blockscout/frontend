import type { TestFixture } from '@playwright/test';

export interface MockRegistration {
  fixture: 'mockApiResponse' | 'mockConfigResponse';
  url: string;
}

export interface MockRegistryFixture {
  registrations: Array<MockRegistration>;
  unmockedUrls: Array<string>;
}

// eslint-disable-next-line no-empty-pattern -- Playwright fixtures must destructure their (here empty) dependencies
const fixture: TestFixture<MockRegistryFixture, object> = async({}, use) => {
  await use({ registrations: [], unmockedUrls: [] });
};

export default fixture;
