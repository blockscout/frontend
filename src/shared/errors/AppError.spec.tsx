// @vitest-environment jsdom

import React from 'react';

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const RATE_LIMIT_ERROR = {
  message: 'Too many requests',
  cause: { status: 429 },
  rateLimits: { bypassOptions: 'temporary_token', reset: '42000' },
} as unknown as Error;

interface RateLimitScreen {
  readonly text: string | null;
  readonly hasBypassButton: boolean;
}

const renderRateLimitScreen = async(siteKey: string): Promise<RateLimitScreen> => {
  return withEnvs([ [ 'NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY', siteKey ] ], async() => {
    const { render, screen } = await import('vitest/lib');
    const { 'default': AppError } = await import('./AppError');

    const view = render(<AppError error={ RATE_LIMIT_ERROR }/>);
    try {
      return {
        text: screen.getByText(/^Rate limit exceeded/).textContent,
        hasBypassButton: screen.queryByRole('button', { name: 'I\'m not a robot' }) !== null,
      };
    } finally {
      view.unmount();
    }
  });
};

describe('rate limit error screen', () => {
  it('offers the wait only when the instance has no reCAPTCHA site key', async() => {
    const screen = await renderRateLimitScreen('');

    expect(screen.text).toBe('Rate limit exceeded. Please wait 00h 00m 42s before making another request.');
    expect(screen.hasBypassButton).toBe(false);
  });

  it('offers the wait or the human check when the instance has a reCAPTCHA site key', async() => {
    const screen = await renderRateLimitScreen('site-key');

    expect(screen.text).toBe('Rate limit exceeded. Please wait 00h 00m 42s OR verify you\'re human before making another request.');
    expect(screen.hasBypassButton).toBe(true);
  });
});
