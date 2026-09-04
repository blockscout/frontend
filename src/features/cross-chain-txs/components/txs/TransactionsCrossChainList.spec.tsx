// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { mdash } from 'src/toolkit/utils/htmlEntities';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest/lib';

import { withUnindexedDestination } from '../../mocks/txs';
import TransactionsCrossChainList from './TransactionsCrossChainList';

const SOURCE_TX_HASH = withUnindexedDestination.source_transaction_hash;
const BRIDGE_NAME = withUnindexedDestination.bridge.name;

describe('TransactionsCrossChainList', () => {
  afterEach(cleanup);

  it('renders a message whose destination never resolves as an ordinary item with an empty destination side', () => {
    const { container } = render(<TransactionsCrossChainList items={ [ withUnindexedDestination ] }/>);

    expect(container.textContent).toContain(SOURCE_TX_HASH);
    expect(container.textContent).toContain(BRIDGE_NAME);
    expect(container.textContent).toContain(`Destination tx${ mdash }`);
    expect(container.textContent).toContain(`Recipient${ mdash }`);
    expect(container.textContent).toContain(`Target token${ mdash }`);
  });
});
