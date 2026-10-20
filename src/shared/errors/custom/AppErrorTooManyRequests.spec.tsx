// @vitest-environment jsdom

import React from 'react';

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

const renderRateLimitPage = async(siteKey: string) => {
  return withEnvs([ [ 'NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY', siteKey ] ], async() => {
    const { render, screen } = await import('vitest/lib');
    const { 'default': AppErrorTooManyRequests } = await import('./AppErrorTooManyRequests');

    const view = render(<AppErrorTooManyRequests bypassOptions="temporary_token" reset="42000"/>);
    const result = {
      text: screen.getByText(/^Rate limit exceeded/).textContent,
      bypassButton: screen.queryByRole('button', { name: 'I\'m not a robot' }),
    };
    view.unmount();

    return result;
  });
};

describe('AppErrorTooManyRequests', () => {
  it('offers the reCAPTCHA bypass when the site key is set', async() => {
    const { text, bypassButton } = await renderRateLimitPage('site-key');

    expect(text).toMatch(/^Rate limit exceeded\. Please wait 00h 00m 42s OR verify you.re human before making another request\.$/);
    expect(bypassButton).not.toBeNull();
  });

  it('shows only the wait time when the site key is not set', async() => {
    const { text, bypassButton } = await renderRateLimitPage('');

    expect(text).toBe('Rate limit exceeded. Please wait 00h 00m 42s before making another request.');
    expect(bypassButton).toBeNull();
  });
});
