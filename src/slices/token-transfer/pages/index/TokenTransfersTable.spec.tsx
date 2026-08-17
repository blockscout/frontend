// @vitest-environment jsdom
// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest/lib';

import { erc1155A, erc1155B, erc1155C, erc1155D, erc20, erc721 } from '../../mocks';
import TokenTransfersTable from './TokenTransfersTable';

const BATCH_PAGE = [ erc1155A, erc1155B, erc1155C, erc1155D ];
const NEXT_PAGE = [ erc20, erc721 ];

describe('TokenTransfersTable', () => {
  afterEach(cleanup);

  it('renders every item of a batch transfer', () => {
    const { container } = render(<TokenTransfersTable items={ BATCH_PAGE } top={ 0 }/>);

    expect(container.querySelectorAll('tbody tr')).toHaveLength(BATCH_PAGE.length);
  });

  it('drops all rows of the previous page when the next page arrives', () => {
    const { container, rerender } = render(<TokenTransfersTable items={ BATCH_PAGE } top={ 0 }/>);

    rerender(<TokenTransfersTable items={ NEXT_PAGE } top={ 0 }/>);

    expect(container.querySelectorAll('tbody tr')).toHaveLength(NEXT_PAGE.length);
    expect(container.textContent).not.toContain(erc1155A.transaction_hash?.slice(0, 10));
  });
});
