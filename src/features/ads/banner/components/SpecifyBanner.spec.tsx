// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import type { SpecifyAd } from '@specify-sh/publisher-sdk';
import React from 'react';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from 'vitest/lib';
import flushPromises from 'vitest/utils/flushPromises';

import SpecifyBanner from './SpecifyBanner';

interface Deferred {
  resolve: (ad: SpecifyAd | null) => void;
}

const serves: Array<Deferred> = [];
const identityListeners: Array<() => void> = [];

vi.mock('@specify-sh/publisher-sdk', () => ({
  ImageFormat: { LONG_BANNER: 'LONG_BANNER', SHORT_BANNER: 'SHORT_BANNER' },
  'default': class Specify {
    setCookieConsent() {}
    identify() {}
    onIdentityChange(listener: () => void) {
      identityListeners.push(listener);
      return () => {};
    }
    serve() {
      return new Promise<SpecifyAd | null>((resolve) => {
        serves.push({ resolve });
      });
    }
  },
}));

const AD: SpecifyAd = {
  adId: 'ad-1',
  campaignId: 'campaign-1',
  communityLogo: '',
  communityName: 'Community',
  content: '',
  ctaLabel: 'Open',
  ctaUrl: 'https://example.com',
  headline: 'Hello',
  imageFormat: 'LONG_BANNER',
  imageUrl: 'https://content.specify.sh/ad.png',
};

const resolveServe = async(index: number, ad: SpecifyAd | null) => {
  await act(async() => {
    serves[index].resolve(ad);
    await flushPromises();
  });
};

const fireIdentityChange = async() => {
  await act(async() => {
    identityListeners.forEach((listener) => listener());
    await flushPromises();
  });
};

describe('SpecifyBanner', () => {
  beforeEach(() => {
    serves.length = 0;
    identityListeners.length = 0;
  });

  afterEach(cleanup);

  it('shows the served ad', async() => {
    const onEmpty = vi.fn();
    render(<SpecifyBanner address={ undefined } isLoading={ false } onEmpty={ onEmpty } format="desktop"/>);

    await resolveServe(0, AD);

    expect(screen.getByAltText('Hello').getAttribute('src')).toBe(AD.imageUrl);
    expect(onEmpty).not.toHaveBeenCalled();
  });

  it('hands the slot over when the only request misses', async() => {
    const onEmpty = vi.fn();
    render(<SpecifyBanner address={ undefined } isLoading={ false } onEmpty={ onEmpty } format="desktop"/>);

    await resolveServe(0, null);

    expect(onEmpty).toHaveBeenCalledTimes(1);
  });

  it('keeps the slot while an identity retry is still in flight after an anonymous miss', async() => {
    const onEmpty = vi.fn();
    render(<SpecifyBanner address={ undefined } isLoading={ false } onEmpty={ onEmpty } format="desktop"/>);

    await fireIdentityChange();
    expect(serves).toHaveLength(2);

    await resolveServe(0, null);
    expect(onEmpty).not.toHaveBeenCalled();

    await resolveServe(1, AD);
    expect(screen.getByAltText('Hello')).toBeDefined();
    expect(onEmpty).not.toHaveBeenCalled();
  });

  it('does not replace a filled slot when the identity improves', async() => {
    const onEmpty = vi.fn();
    render(<SpecifyBanner address={ undefined } isLoading={ false } onEmpty={ onEmpty } format="desktop"/>);

    await resolveServe(0, AD);
    await fireIdentityChange();

    expect(serves).toHaveLength(1);
    expect(screen.getByAltText('Hello')).toBeDefined();
  });
});
