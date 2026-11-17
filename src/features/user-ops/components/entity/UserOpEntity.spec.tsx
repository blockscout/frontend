// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { MultichainContext } from 'src/features/multichain/context';
import * as clusterChains from 'src/features/multichain/mocks/chains';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';

import UserOpEntity from './UserOpEntity';

const HASH = '0x376db52955d5bce114d0ccea2dcf22289b4eae1b86bcae5a59bb5fdbfef48899';

describe('UserOpEntity', () => {
  afterEach(cleanup);

  it('links to the user operation page with its icon and a copy button', () => {
    render(<UserOpEntity hash={ HASH }/>);

    expect(screen.getByRole('link')).toHaveProperty('href', `http://localhost:3000/op/${ HASH }`);
    expect(document.querySelector('use')?.getAttribute('href')).toBe('#user_op');
    expect(screen.queryByRole('button', { name: 'copy' })).not.toBeNull();
  });

  it('links to the chain-scoped page inside a multichain context', () => {
    render(
      <MultichainContext.Provider value={{ chain: clusterChains.chainA }}>
        <UserOpEntity hash={ HASH }/>
      </MultichainContext.Provider>,
    );

    expect(screen.getByRole('link')).toHaveProperty('href', `http://localhost:3000/chain/op-mainnet/op/${ HASH }`);
  });
});
