// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from 'vitest/lib';

import TxType from './TxType';

describe('TxType', () => {
  afterEach(cleanup);

  it.each([
    [ 'op_stack_l1_attributes_transaction' as const, 'L1 attr tx' ],
    [ 'op_stack_post_exec_transaction' as const, 'Post exec tx' ],
  ])('renders the label for %s', (type, label) => {
    render(<TxType types={ [ type ] }/>);

    expect(screen.queryByText(label)).not.toBeNull();
  });

  it('prefers a more informative type over sponsored_transaction', () => {
    render(<TxType types={ [ 'sponsored_transaction', 'contract_call' ] }/>);

    expect(screen.queryByText('Contract call')).not.toBeNull();
  });

  it('falls back to the generic label when a transaction is only sponsored', () => {
    render(<TxType types={ [ 'sponsored_transaction' ] }/>);

    expect(screen.queryByText('Transaction')).not.toBeNull();
  });
});
