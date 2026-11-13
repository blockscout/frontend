// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';

import TxInterpretationDexTag from './TxInterpretationDexTag';

const MARKET = { name: 'Uniswap', icon: 'https://uniswap.example/icon.png', url: 'https://uniswap.example' };

describe('TxInterpretationDexTag', () => {
  afterEach(cleanup);

  it('links the market name to its site', () => {
    render(<TxInterpretationDexTag value={ MARKET }/>);

    const link = screen.getByRole('link');
    expect(link.textContent).toBe('Uniswap');
    expect(link).toHaveProperty('href', 'https://uniswap.example/');
  });

  it('shows the market name as plain text when it has no site', () => {
    render(<TxInterpretationDexTag value={{ ...MARKET, url: '' }}/>);

    expect(screen.getByText('Uniswap')).toBeTruthy();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('shows the market name as plain text in the no-link mode', () => {
    render(<TxInterpretationDexTag value={ MARKET } noLink/>);

    expect(screen.getByText('Uniswap')).toBeTruthy();
    expect(screen.queryByRole('link')).toBeNull();
  });
});
