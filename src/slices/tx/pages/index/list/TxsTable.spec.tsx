// @vitest-environment jsdom

import React from 'react';

import * as txMock from 'src/slices/tx/mocks/list';

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from 'vitest/lib';

import TxsTable from './TxsTable';

afterEach(cleanup);

describe('TxsTable', () => {
  it('toggles the block number sort from the Block header', () => {
    const onSortToggle = vi.fn();
    render(<TxsTable txs={ [ txMock.base ] } sort="default" onSortToggle={ onSortToggle } top={ 0 } showBlockInfo/>);

    fireEvent.click(screen.getByText('Block', { selector: 'th *' }));

    expect(onSortToggle).toHaveBeenCalledWith('block_number');
  });

  it('keeps the Block header static when block sort is unavailable', () => {
    const onSortToggle = vi.fn();
    render(<TxsTable txs={ [ txMock.base ] } sort="default" onSortToggle={ onSortToggle } top={ 0 } showBlockInfo withBlockSort={ false }/>);

    fireEvent.click(screen.getByRole('columnheader', { name: 'Block' }));

    expect(onSortToggle).not.toHaveBeenCalled();
  });
});
