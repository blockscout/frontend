// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { mdash } from 'src/toolkit/utils/htmlEntities';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest/lib';

import { pending, withUnindexedDestination } from '../../mocks/txs';
import TransactionsCrossChainTable from './TransactionsCrossChainTable';

const SOURCE_CHAIN_NAME = withUnindexedDestination.source_chain.name;
const BRIDGE_NAME = withUnindexedDestination.bridge.name;
const PENDING_DESTINATION_CHAIN_NAME = pending.destination_chain.name;

function firstRowCellByColumn(container: HTMLElement, header: string): Element {
  const headers = Array.from(container.querySelectorAll('thead th'));
  const index = headers.findIndex((cell) => cell.textContent?.trim() === header);

  if (index < 0) {
    throw new Error(`no "${ header }" column in the table header`);
  }

  return container.querySelectorAll('tbody tr:first-child td')[index];
}

describe('TransactionsCrossChainTable', () => {
  afterEach(cleanup);

  it('renders a message whose destination never resolves as an ordinary row with an empty destination side', () => {
    const { container } = render(<TransactionsCrossChainTable data={ [ withUnindexedDestination ] }/>);

    expect(firstRowCellByColumn(container, 'Source tx').textContent).toContain(SOURCE_CHAIN_NAME);
    expect(firstRowCellByColumn(container, 'Protocol').textContent).toContain(BRIDGE_NAME);
    expect(firstRowCellByColumn(container, 'Dest tx').textContent).toBe(mdash);
    expect(firstRowCellByColumn(container, 'Recipient').textContent).toBe(mdash);
  });

  it('leaves the destination tx empty on a row that has no destination hash yet and is not flagged as unindexed', () => {
    const { container } = render(<TransactionsCrossChainTable data={ [ pending ] }/>);

    expect(firstRowCellByColumn(container, 'Dest tx').textContent)
      .toBe(`${ mdash }${ PENDING_DESTINATION_CHAIN_NAME }`);
  });
});
