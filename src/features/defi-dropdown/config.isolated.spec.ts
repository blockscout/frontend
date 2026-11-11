// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import type deFiDropdownConfig from './config';

const ITEMS_ENV: [ string, string ] = [
  'NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS',
  '[{"text":"Swap","dappId":"uniswap"},{"text":"Payment link","url":"https://example.com"}]',
];

async function loadConfig(envs: Array<[ string, string ]>): Promise<typeof deFiDropdownConfig> {
  return withEnvs(envs, async() => {
    // `src/config` has to be imported first: reaching it through `./config` instead enters the
    // graph mid-cycle, and `src/shell/metadata/config` then reads `app.baseUrl` off an
    // uninitialised module
    await import('src/config');
    return (await import('./config')).default;
  });
}

describe('DeFi dropdown feature config', () => {
  it('is disabled without any items', async() => {
    expect((await loadConfig([])).isEnabled).toBe(false);
  });

  it('labels the button "Blockscout DeFi", shortened to "DeFi", when the text env is unset', async() => {
    expect(await loadConfig([ ITEMS_ENV ])).toMatchObject({
      isEnabled: true,
      buttonText: { desktop: 'Blockscout DeFi', mobile: 'DeFi' },
    });
  });

  it('takes both forms from NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT', async() => {
    const config = await loadConfig([
      ITEMS_ENV,
      [ 'NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT', '{"desktop":"MyChain DeFi","mobile":"DeFi"}' ],
    ]);
    expect(config).toMatchObject({ buttonText: { desktop: 'MyChain DeFi', mobile: 'DeFi' } });
  });

  it('reuses the desktop form on mobile when the text env omits a mobile one', async() => {
    const config = await loadConfig([
      ITEMS_ENV,
      [ 'NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT', '{"desktop":"Trade"}' ],
    ]);
    expect(config).toMatchObject({ buttonText: { desktop: 'Trade', mobile: 'Trade' } });
  });

  it('ignores a malformed text env and keeps the default label', async() => {
    const config = await loadConfig([
      ITEMS_ENV,
      [ 'NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT', 'not json' ],
    ]);
    expect(config).toMatchObject({ buttonText: { desktop: 'Blockscout DeFi', mobile: 'DeFi' } });
  });
});
