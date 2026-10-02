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

const renderOpenedWithReset = (selected: boolean) => {
  const onReset = vi.fn();
  render(
    <ColumnsButton
      tableColumns={ TABLE_COLUMNS }
      columns={{ hash: true, from: false, amount: true }}
      onChange={ vi.fn() }
      selected={ selected }
      onReset={ onReset }
    />,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Columns' }));
  return { onReset };
};

const findResetButton = (): Promise<HTMLButtonElement> => screen.findByRole('button', { name: 'Reset', hidden: true });

const getCheckbox = (name: string): HTMLInputElement => screen.getByRole('checkbox', { name, hidden: true });
const isChecked = (name: string): boolean => getCheckbox(name).checked;

describe('ColumnsButton', () => {
  afterEach(cleanup);

  it('renders an icon-only trigger without a text label', () => {
    render(<ColumnsButton tableColumns={ TABLE_COLUMNS } columns={{ hash: true, from: true, amount: true }} onChange={ vi.fn() }/>);

    const trigger = screen.getByRole('button', { name: 'Columns' });
    expect(trigger.textContent).toBe('');
  });

  it('marks the trigger as selected only when asked to', () => {
    const { rerender } = render(<ColumnsButton tableColumns={ TABLE_COLUMNS } columns={{ hash: true }} onChange={ vi.fn() } selected/>);
    expect(screen.getByRole('button', { name: 'Columns' }).hasAttribute('data-selected')).toBe(true);

    rerender(<ColumnsButton tableColumns={ TABLE_COLUMNS } columns={{ hash: true }} onChange={ vi.fn() }/>);
    expect(screen.getByRole('button', { name: 'Columns' }).hasAttribute('data-selected')).toBe(false);
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

  it('offers no Reset without a reset handler', async() => {
    renderOpened({ hash: true, from: true, amount: true });

    await screen.findByText('Txn hash');
    expect(screen.queryByRole('button', { name: 'Reset', hidden: true })).toBeNull();
  });

  it('resets the columns from the selector when they are customized', async() => {
    const { onReset } = renderOpenedWithReset(true);

    const resetButton = await findResetButton();
    expect(resetButton.disabled).toBe(false);
    fireEvent.click(resetButton);

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('disables Reset while the columns are the defaults', async() => {
    renderOpenedWithReset(false);

    expect((await findResetButton()).disabled).toBe(true);
  });
});
