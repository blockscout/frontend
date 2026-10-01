// @vitest-environment jsdom

import React from 'react';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from 'vitest/lib';

import ColumnsButton from './ColumnsButton';

type ColumnId = 'hash' | 'from' | 'amount';

const TABLE_COLUMNS = [
  { id: 'hash' as const, name: 'Txn hash' },
  { id: 'from' as const, name: 'From' },
  { id: 'amount' as const, name: 'Amount' },
];

const renderOpened = (columns: Record<ColumnId, boolean>) => {
  const onChange = vi.fn();
  render(<ColumnsButton tableColumns={ TABLE_COLUMNS } columns={ columns } onChange={ onChange }/>);
  fireEvent.click(screen.getByRole('button', { name: 'Columns' }));
  return { onChange };
};

const getCheckbox = (name: string): HTMLInputElement => screen.getByRole('checkbox', { name, hidden: true });
const isChecked = (name: string): boolean => getCheckbox(name).checked;

describe('ColumnsButton', () => {
  afterEach(cleanup);

  it('renders an icon-only trigger without a text label', () => {
    render(<ColumnsButton tableColumns={ TABLE_COLUMNS } columns={{ hash: true, from: true, amount: true }} onChange={ vi.fn() }/>);

    const trigger = screen.getByRole('button', { name: 'Columns' });
    expect(trigger.textContent).toBe('');
  });

  it('offers every table column by its display name, checked per the current selection', async() => {
    renderOpened({ hash: true, from: false, amount: true });

    await screen.findByText('Txn hash');
    expect(isChecked('Txn hash')).toBe(true);
    expect(isChecked('From')).toBe(false);
    expect(isChecked('Amount')).toBe(true);
  });

  it('emits the selection with a column switched off', async() => {
    const { onChange } = renderOpened({ hash: true, from: true, amount: true });

    await screen.findByText('From');
    fireEvent.click(getCheckbox('From'));

    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith({ hash: true, amount: true }));
  });

  it('emits the selection with a column switched on', async() => {
    const { onChange } = renderOpened({ hash: true, from: false, amount: false });

    await screen.findByText('Amount');
    fireEvent.click(getCheckbox('Amount'));

    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith({ hash: true, amount: true }));
  });
});
