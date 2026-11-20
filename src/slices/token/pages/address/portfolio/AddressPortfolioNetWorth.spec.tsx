// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import React from 'react';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';

import AddressPortfolioNetWorth from './AddressPortfolioNetWorth';

const ADDRESS_HASH = '0x1234567890123456789012345678901234567890';
const EMPTY_TEXT = 'There are no tokens at this address';

describe('net-worth plate breakdown', () => {
  afterEach(() => {
    cleanup();
  });

  it('does not claim the address is empty while its holdings are loading', () => {
    render(<AddressPortfolioNetWorth addressHash={ ADDRESS_HASH } isLoading topTokens={ undefined }/>);

    expect(screen.queryByText(EMPTY_TEXT)).toBeNull();
  });

  it('says the address holds no tokens once loading settles without a breakdown', () => {
    render(<AddressPortfolioNetWorth addressHash={ ADDRESS_HASH } isLoading={ false } topTokens={ undefined }/>);

    expect(screen.getByText(EMPTY_TEXT)).toBeTruthy();
  });
});
