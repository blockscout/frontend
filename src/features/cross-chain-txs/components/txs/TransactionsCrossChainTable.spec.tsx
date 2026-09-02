// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { mdash } from 'src/toolkit/utils/htmlEntities';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest/lib';

import { pending, withUnindexedDestination } from '../../mocks/txs';
import TransactionsCrossChainTable from './TransactionsCrossChainTable';

const SOURCE_TX_CELL_INDEX = 4;
const DESTINATION_TX_CELL_INDEX = 5;
const RECIPIENT_CELL_INDEX = 8;
const PROTOCOL_CELL_INDEX = 9;

const SOURCE_CHAIN_NAME = withUnindexedDestination.source_chain.name;
const BRIDGE_NAME = withUnindexedDestination.bridge.name;
const PENDING_DESTINATION_CHAIN_NAME = pending.destination_chain.name;

describe('TransactionsCrossChainTable', () => {
  afterEach(cleanup);

  it('renders a message whose destination never resolves as an ordinary row with an empty destination side', () => {
    const { container } = render(<TransactionsCrossChainTable data={ [ withUnindexedDestination ] }/>);

    const cells = container.querySelectorAll('tbody tr:first-child td');

    expect(cells[SOURCE_TX_CELL_INDEX].textContent).toContain(SOURCE_CHAIN_NAME);
    expect(cells[PROTOCOL_CELL_INDEX].textContent).toContain(BRIDGE_NAME);
    expect(cells[DESTINATION_TX_CELL_INDEX].textContent).toBe(mdash);
    expect(cells[RECIPIENT_CELL_INDEX].textContent).toBe(mdash);
  });

  it('leaves the destination tx empty on a row that has no destination hash yet and is not flagged as unindexed', () => {
    const { container } = render(<TransactionsCrossChainTable data={ [ pending ] }/>);

    const cells = container.querySelectorAll('tbody tr:first-child td');

    expect(cells[DESTINATION_TX_CELL_INDEX].textContent).toBe(`${ mdash }${ PENDING_DESTINATION_CHAIN_NAME }`);
  });
});
