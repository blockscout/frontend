// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { MultichainContext } from 'src/features/multichain/context';
import * as clusterChains from 'src/features/multichain/mocks/chains';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';

import FlashblockEntity from './FlashblockEntity';

const NUMBER = 123456789;
const INDEX = 3;
const TEXT = `${ NUMBER } #${ INDEX }`;

describe('FlashblockEntity', () => {
  afterEach(cleanup);

  it('links to the block page with the flashblock icon and no copy button', () => {
    render(<FlashblockEntity number={ NUMBER } index={ INDEX }/>);

    expect(screen.getByRole('link')).toHaveProperty('href', `http://localhost:3000/block/${ NUMBER }`);
    expect(document.querySelector('use')?.getAttribute('href')).toBe('#flashblock');
    expect(screen.queryByRole('button', { name: 'copy' })).toBeNull();
  });

  it('shows the whole number and index by default', () => {
    render(<FlashblockEntity number={ NUMBER } index={ INDEX }/>);

    expect(screen.getByText(TEXT)).toBeTruthy();
  });

  it('truncates when the caller asks for it', () => {
    render(<FlashblockEntity number={ NUMBER } index={ INDEX } truncation="constant"/>);

    expect(screen.queryByText(TEXT)).toBeNull();
    expect(screen.getByText(`#${ INDEX }`, { exact: false })).toBeTruthy();
  });

  it('links to the chain-scoped page inside a multichain context', () => {
    render(
      <MultichainContext.Provider value={{ chain: clusterChains.chainA }}>
        <FlashblockEntity number={ NUMBER } index={ INDEX }/>
      </MultichainContext.Provider>,
    );

    expect(screen.getByRole('link')).toHaveProperty('href', `http://localhost:3000/chain/op-mainnet/block/${ NUMBER }`);
  });
});
