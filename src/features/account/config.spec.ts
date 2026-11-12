// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import type accountConfig from './config';

async function loadConfig(envs: Array<[ string, string ]>): Promise<typeof accountConfig> {
  return withEnvs(envs, async() => {
    // `src/config` has to be imported first: reaching it through `./config` instead enters the
    // graph mid-cycle, and `src/shell/metadata/config` then reads `app.baseUrl` off an
    // uninitialised module
    await import('src/config');
    return (await import('./config')).default;
  });
}

const HTML_AS_SET = `Don't miss <a href='https://example.com'>this</a>`;

describe('account feature config', () => {
  it('is disabled when the account is not supported', async() => {
    expect((await loadConfig([ [ 'NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED', '' ] ])).isEnabled).toBe(false);
  });

  it('is disabled without a dynamic environment id or a reCaptcha site key', async() => {
    expect((await loadConfig([ [ 'NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY', '' ] ])).isEnabled).toBe(false);
  });

  it('signs in through auth0 with the reCaptcha site key', async() => {
    expect(await loadConfig([])).toMatchObject({
      isEnabled: true,
      authProvider: 'auth0',
      verifiedAddresses: { isEnabled: true },
    });
  });

  it('signs in through dynamic with its environment id', async() => {
    expect(await loadConfig([
      [ 'NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER', 'dynamic' ],
      [ 'NEXT_PUBLIC_ACCOUNT_DYNAMIC_ENVIRONMENT_ID', 'env-1' ],
    ])).toMatchObject({
      isEnabled: true,
      authProvider: 'dynamic',
      dynamic: { environmentId: 'env-1' },
    });
  });

  it('has no verified addresses without the admin service API', async() => {
    expect(await loadConfig([ [ 'NEXT_PUBLIC_ADMIN_SERVICE_API_HOST', '' ] ])).toMatchObject({
      isEnabled: true,
      verifiedAddresses: undefined,
    });
  });

  it('keeps the HTML values as set, apostrophes and single quotes included', async() => {
    expect(await loadConfig([
      [ 'NEXT_PUBLIC_API_KEYS_ALERT_MESSAGE', HTML_AS_SET ],
      [ 'NEXT_PUBLIC_TOKEN_INFO_EXPEDITED_REVIEW_HTML', HTML_AS_SET ],
    ])).toMatchObject({
      apiKeys: { alertMessage: HTML_AS_SET },
      verifiedAddresses: { expeditedReviewHtml: HTML_AS_SET },
    });
  });

  it('shows the built-in API keys notice on chains with the Blockscout API unless the value is set empty', async() => {
    const withNotice = await loadConfig([ [ 'NEXT_PUBLIC_PRO_API_SUPPORTED', 'true' ] ]);
    expect(withNotice.isEnabled && withNotice.apiKeys.alertMessage).toContain('Deprecation Notice');

    const optedOut = await loadConfig([ [ 'NEXT_PUBLIC_PRO_API_SUPPORTED', 'true' ], [ 'NEXT_PUBLIC_API_KEYS_ALERT_MESSAGE', '' ] ]);
    expect(optedOut.isEnabled && optedOut.apiKeys.alertMessage).toBe('');

    const otherChain = await loadConfig([ [ 'NEXT_PUBLIC_PRO_API_SUPPORTED', '' ] ]);
    expect(otherChain.isEnabled && otherChain.apiKeys.alertMessage).toBeUndefined();
  });
});
