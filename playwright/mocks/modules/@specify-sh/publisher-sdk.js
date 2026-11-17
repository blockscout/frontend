// Mock for @specify-sh/publisher-sdk to avoid build issues in Playwright component tests

export const ImageFormat = {
  LANDSCAPE: 'LANDSCAPE',
  LONG_BANNER: 'LONG_BANNER',
  NO_IMAGE: 'NO_IMAGE',
  SHORT_BANNER: 'SHORT_BANNER',
};

export default class Specify {
  constructor(options) {
    this.publisherKey = options.publisherKey;
  }

  setCookieConsent() {}

  hasCookieConsent() {
    return false;
  }

  identify() {}

  onIdentityChange() {
    return () => {};
  }

  async serve() {
    // Mock implementation that returns null to simulate no ad
    return null;
  }
}
