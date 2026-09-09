// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';
import withEnvs from 'vitest/utils/mockEnvs';

const ITEMS_ENV: [ string, string ] = [
  'NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS',
  '[{"text":"Swap","dappId":"uniswap"},{"text":"Payment link","url":"https://example.com"}]',
];

async function renderDropdown(envs: Array<[ string, string ]>) {
  return withEnvs(envs, async() => {
    const { 'default': DeFiDropdown } = await import('./DeFiDropdown');
    render(<DeFiDropdown/>);
  });
}

describe('DeFiDropdown', () => {
  afterEach(cleanup);

  it('labels the trigger "Blockscout DeFi", shortened to "DeFi", by default', async() => {
    await renderDropdown([ ITEMS_ENV ]);

    expect(screen.queryByText('Blockscout DeFi')).not.toBeNull();
    expect(screen.queryByText('DeFi')).not.toBeNull();
  });

  it('labels the trigger with both forms from NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT', async() => {
    await renderDropdown([
      ITEMS_ENV,
      [ 'NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT', '{"desktop":"MyChain DeFi hub","mobile":"Hub"}' ],
    ]);

    expect(screen.queryByText('MyChain DeFi hub')).not.toBeNull();
    expect(screen.queryByText('Hub')).not.toBeNull();
    expect(screen.queryByText('Blockscout DeFi')).toBeNull();
  });
});
