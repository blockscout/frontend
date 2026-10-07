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
const ALL_COLUMNS = [ 'tx_hash', 'type', 'transfer_type', 'method', 'timestamp', 'block', 'from_to', 'amount', 'asset', 'value' ] as const;
// The backend can push a transfer whose token is not catalogued yet (seen on
// the address Token transfers tab via the websocket feed). The schema types the
// field as non-null, so the mock has to be cast.
const WITHOUT_TOKEN = { ...erc20, token: null } as unknown as schemas['TokenTransfer'];

const getHeaders = (container: HTMLElement) => Array.from(container.querySelectorAll('thead th')).map((th) => th.textContent);

describe('TokenTransfersTable', () => {
  afterEach(cleanup);

  it('renders every item of a batch transfer', () => {
    const { container } = render(<TokenTransfersTable surface="index" columns={ ALL_COLUMNS } items={ BATCH_PAGE }/>);

    expect(container.querySelectorAll('tbody tr')).toHaveLength(BATCH_PAGE.length);
  });

  it('drops all rows of the previous page when the next page arrives', () => {
    const { container, rerender } = render(<TokenTransfersTable surface="index" columns={ ALL_COLUMNS } items={ BATCH_PAGE }/>);

    rerender(<TokenTransfersTable surface="index" columns={ ALL_COLUMNS } items={ NEXT_PAGE }/>);

    expect(container.querySelectorAll('tbody tr')).toHaveLength(NEXT_PAGE.length);
    expect(container.textContent).not.toContain(erc1155A.transaction_hash?.slice(0, 10));
  });

  it('renders every column of the vocabulary in order', () => {
    const { container } = render(<TokenTransfersTable surface="index" columns={ ALL_COLUMNS } items={ NEXT_PAGE }/>);

    expect(getHeaders(container)).toEqual(
      [ 'Txn hash', 'Token type', 'Transfer type', 'Method', 'Timestamp', 'Block', 'From / To', 'Amount', 'ID / Asset', 'Value' ],
    );
    expect(container.querySelectorAll('tbody tr:first-child td')).toHaveLength(ALL_COLUMNS.length);
  });

  it('renders the columns in the order they are passed in', () => {
    const { container } = render(<TokenTransfersTable surface="index" columns={ [ 'value', 'tx_hash', 'type' ] } items={ NEXT_PAGE }/>);

    expect(getHeaders(container)).toEqual([ 'Value', 'Txn hash', 'Token type' ]);
    const [ , txHashCell ] = Array.from(container.querySelectorAll('tbody tr:first-child td'));
    expect(txHashCell.textContent).toContain(erc20.transaction_hash?.slice(0, 4));
  });

  it('does not render a column that is unavailable on the surface', () => {
    const { container } = render(<TokenTransfersTable surface="tx" columns={ ALL_COLUMNS } items={ NEXT_PAGE }/>);

    expect(getHeaders(container)).toEqual([ 'Token type', 'Transfer type', 'From / To', 'Amount', 'ID / Asset', 'Value' ]);
  });

  it('puts the time format toggle in the timestamp header', () => {
    const { container } = render(<TokenTransfersTable surface="index" columns={ [ 'tx_hash', 'timestamp' ] } items={ NEXT_PAGE }/>);
    const [ txHashHeader, timestampHeader ] = Array.from(container.querySelectorAll('thead th')) as Array<HTMLElement>;

    expect(within(timestampHeader).getByRole('button', { name: 'Toggle time format' })).toBeDefined();
    expect(within(txHashHeader).queryByRole('button')).toBeNull();
  });

  it('renders no chain column outside a multichain context', () => {
    render(<TokenTransfersTable surface="index" columns={ [ 'tx_hash' ] } items={ NEXT_PAGE }/>);

    expect(screen.getAllByRole('columnheader')).toHaveLength(1);
  });

  it('renders a row without a token instead of crashing', () => {
    const { container } = render(<TokenTransfersTable surface="index" columns={ ALL_COLUMNS } items={ [ WITHOUT_TOKEN ] }/>);

    expect(container.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(container.querySelectorAll('tbody tr td')).toHaveLength(ALL_COLUMNS.length);
  });

  it('renders the token surface defaults', () => {
    const columns = getDefaultColumnIds(TOKEN_TRANSFER_COLUMNS, getSurfaceColumnStates('token', {}));
    const { container } = render(<TokenTransfersTable surface="token" columns={ columns } items={ NEXT_PAGE }/>);

    expect(getHeaders(container)).toEqual([ 'Txn hash', 'Method', 'Timestamp', 'From / To', 'Amount', 'ID / Asset', 'Value' ]);
  });
});
