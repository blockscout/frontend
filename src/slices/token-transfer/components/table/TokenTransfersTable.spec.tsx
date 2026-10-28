// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { getDefaultColumnIds } from 'src/shared/lists/columns/column-overrides';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from 'vitest/lib';

import { erc1155A, erc1155B, erc1155C, erc1155D, erc20, erc721 } from '../../mocks';
import { getSurfaceColumnStates, TOKEN_TRANSFER_COLUMNS } from '../../utils/columns';
import TokenTransfersTable from './TokenTransfersTable';

const BATCH_PAGE = [ erc1155A, erc1155B, erc1155C, erc1155D ];
const NEXT_PAGE = [ erc20, erc721 ];
const ALL_COLUMNS = [ 'in_out', 'tx_hash', 'type', 'transfer_type', 'method', 'timestamp', 'block', 'from_to', 'amount', 'asset', 'value' ] as const;
// The backend can push a transfer whose token is not catalogued yet (seen on
// the address Token transfers tab via the websocket feed). The schema types the
// field as non-null, so the mock has to be cast.
const WITHOUT_TOKEN = { ...erc20, token: null } as unknown as schemas['TokenTransfer'];

const getHeaders = () => screen.getAllByRole('columnheader').map((header) => header.textContent);
const getBodyRows = () => {
  const [ , body ] = screen.getAllByRole('rowgroup');
  return within(body).queryAllByRole('row');
};
const getCells = (row: HTMLElement) => within(row).getAllByRole('cell');

describe('TokenTransfersTable', () => {
  afterEach(cleanup);

  it('renders every item of a batch transfer', () => {
    render(<TokenTransfersTable columns={ ALL_COLUMNS } items={ BATCH_PAGE }/>);

    expect(getBodyRows()).toHaveLength(BATCH_PAGE.length);
  });

  it('drops all rows of the previous page when the next page arrives', () => {
    const { container, rerender } = render(<TokenTransfersTable columns={ ALL_COLUMNS } items={ BATCH_PAGE }/>);

    rerender(<TokenTransfersTable columns={ ALL_COLUMNS } items={ NEXT_PAGE }/>);

    expect(getBodyRows()).toHaveLength(NEXT_PAGE.length);
    expect(container.textContent).not.toContain(erc1155A.transaction_hash?.slice(0, 10));
  });

  it('renders every column of the vocabulary in order', () => {
    render(<TokenTransfersTable columns={ ALL_COLUMNS } items={ NEXT_PAGE }/>);

    expect(getHeaders()).toEqual(
      [ 'In / Out', 'Txn hash', 'Token type', 'Transfer type', 'Method', 'Timestamp', 'Block', 'From / To', 'Amount', 'ID / Asset', 'Value' ],
    );
    expect(getCells(getBodyRows()[0])).toHaveLength(ALL_COLUMNS.length);
  });

  it('renders the columns in the order they are passed in', () => {
    render(<TokenTransfersTable columns={ [ 'value', 'tx_hash', 'type' ] } items={ NEXT_PAGE }/>);

    expect(getHeaders()).toEqual([ 'Value', 'Txn hash', 'Token type' ]);
    const [ , txHashCell ] = getCells(getBodyRows()[0]);
    expect(txHashCell.textContent).toContain(erc20.transaction_hash?.slice(0, 4));
  });

  it('renders every column it is given, multiplier included', () => {
    render(<TokenTransfersTable columns={ [ 'tx_hash', 'multiplier', 'amount' ] } items={ NEXT_PAGE }/>);

    expect(getHeaders()).toEqual([ 'Txn hash', 'Multiplier', 'Amount' ]);
  });

  it('puts the time format toggle in the timestamp header', () => {
    render(<TokenTransfersTable columns={ [ 'tx_hash', 'timestamp' ] } items={ NEXT_PAGE }/>);
    const [ txHashHeader, timestampHeader ] = screen.getAllByRole('columnheader');

    expect(within(timestampHeader).getByRole('button', { name: 'Toggle time format' })).toBeDefined();
    expect(within(txHashHeader).queryByRole('button')).toBeNull();
  });

  it('renders no chain column outside a multichain context', () => {
    render(<TokenTransfersTable columns={ [ 'tx_hash' ] } items={ NEXT_PAGE }/>);

    expect(screen.getAllByRole('columnheader')).toHaveLength(1);
  });

  it('renders a row without a token instead of crashing', () => {
    render(<TokenTransfersTable columns={ ALL_COLUMNS } items={ [ WITHOUT_TOKEN ] }/>);

    expect(getBodyRows()).toHaveLength(1);
    expect(getCells(getBodyRows()[0])).toHaveLength(ALL_COLUMNS.length);
  });

  it('renders the address surface defaults, In / Out first', () => {
    const columns = getDefaultColumnIds(TOKEN_TRANSFER_COLUMNS, getSurfaceColumnStates('address', {}));
    render(<TokenTransfersTable columns={ columns } items={ NEXT_PAGE } baseAddress={ erc20.to.hash }/>);

    expect(getHeaders()).toEqual(
      [ 'In / Out', 'Txn hash', 'Token type', 'Timestamp', 'From / To', 'Amount', 'ID / Asset', 'Value' ],
    );
    expect(getCells(getBodyRows()[0])[0].textContent).toBe('In');
  });

  it('renders the token surface defaults', () => {
    const columns = getDefaultColumnIds(TOKEN_TRANSFER_COLUMNS, getSurfaceColumnStates('token', {}));
    render(<TokenTransfersTable columns={ columns } items={ NEXT_PAGE }/>);

    expect(getHeaders()).toEqual([ 'Txn hash', 'Timestamp', 'From / To', 'Amount', 'ID / Asset', 'Value' ]);
  });
});
