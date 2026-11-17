// @vitest-environment jsdom

import React from 'react';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from 'vitest/lib';
import flushPromises from 'vitest/utils/flushPromises';

import ColumnsButton from './ColumnsButton';

type ColumnId = 'hash' | 'from' | 'amount';

const TABLE_COLUMNS = [
  { id: 'hash' as const, name: 'Txn hash' },
  { id: 'from' as const, name: 'From' },
  { id: 'amount' as const, name: 'Amount' },
];

const ROW_PITCH = 40;

const renderOpened = (columns: Record<ColumnId, boolean>) => {
  const onChange = vi.fn();
  const onOrderChange = vi.fn();
  render(<ColumnsButton tableColumns={ TABLE_COLUMNS } columns={ columns } onChange={ onChange } onOrderChange={ onOrderChange }/>);
  fireEvent.click(screen.getByRole('button', { name: 'Columns' }));
  return { onChange, onOrderChange };
};

const renderOpenedWithReset = (selected: boolean) => {
  const onReset = vi.fn();
  render(
    <ColumnsButton
      tableColumns={ TABLE_COLUMNS }
      columns={{ hash: true, from: false, amount: true }}
      onChange={ vi.fn() }
      onOrderChange={ vi.fn() }
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

const findSortableHandle = async(name: string): Promise<HTMLElement> => {
  const handle = await screen.findByRole('button', { name: `Reorder ${ name }`, hidden: true });
  await waitFor(() => expect(handle.getAttribute('aria-roledescription')).toBe('sortable'));
  return handle;
};

const pressKey = (element: HTMLElement, code: string) => {
  fireEvent.keyDown(element, { code });
};

// the keyboard sensor starts listening for the move and drop keys on the next tick after the pick-up
const pickUp = async(handle: HTMLElement) => {
  handle.focus();
  pressKey(handle, 'Space');
  await act(flushPromises);
};

const getRowNames = (): Array<string> => screen
  .getAllByRole('checkbox', { hidden: true })
  .map((checkbox) => checkbox.closest('label')?.textContent ?? '');

// jsdom has no layout, and the keyboard sensor finds the next row by its position
function stackRowsVertically(this: HTMLElement): DOMRect {
  const index = this.parentElement ? Array.from(this.parentElement.children).indexOf(this) : 0;
  return new DOMRect(0, index * ROW_PITCH, 200, ROW_PITCH - 8);
}

describe('ColumnsButton', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(stackRowsVertically);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders an icon-only trigger without a text label', () => {
    render(<ColumnsButton tableColumns={ TABLE_COLUMNS } columns={{ hash: true, from: true, amount: true }} onChange={ vi.fn() } onOrderChange={ vi.fn() }/>);

    const trigger = screen.getByRole('button', { name: 'Columns' });
    expect(trigger.textContent).toBe('');
  });

  it('marks the trigger as selected only when asked to', () => {
    const { rerender } = render(
      <ColumnsButton tableColumns={ TABLE_COLUMNS } columns={{ hash: true }} onChange={ vi.fn() } onOrderChange={ vi.fn() } selected/>,
    );
    expect(screen.getByRole('button', { name: 'Columns' }).hasAttribute('data-selected')).toBe(true);

    rerender(<ColumnsButton tableColumns={ TABLE_COLUMNS } columns={{ hash: true }} onChange={ vi.fn() } onOrderChange={ vi.fn() }/>);
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

    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith({ hash: true, from: false, amount: true }));
  });

  it('emits the selection with a column switched on', async() => {
    const { onChange } = renderOpened({ hash: true, from: false, amount: false });

    await screen.findByText('Amount');
    fireEvent.click(getCheckbox('Amount'));

    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith({ hash: true, from: false, amount: true }));
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

  it('lists the columns in the given order, one handle per row', async() => {
    renderOpened({ hash: true, from: false, amount: true });

    await findSortableHandle('Txn hash');
    expect(getRowNames()).toEqual([ 'Txn hash', 'From', 'Amount' ]);
    expect(screen.getAllByRole('button', { name: /^Reorder/, hidden: true })).toHaveLength(TABLE_COLUMNS.length);
  });

  it('moves a column down with the keyboard and reports the new order', async() => {
    const { onOrderChange } = renderOpened({ hash: true, from: true, amount: true });

    const handle = await findSortableHandle('Txn hash');
    await pickUp(handle);
    pressKey(handle, 'ArrowDown');
    pressKey(handle, 'Space');

    await waitFor(() => expect(onOrderChange).toHaveBeenCalledWith([ 'from', 'hash', 'amount' ], 'hash'));
    expect(onOrderChange).toHaveBeenCalledTimes(1);
  });

  it('moves a hidden column up with the keyboard', async() => {
    const { onOrderChange } = renderOpened({ hash: true, from: true, amount: false });

    const handle = await findSortableHandle('Amount');
    await pickUp(handle);
    pressKey(handle, 'ArrowUp');
    pressKey(handle, 'ArrowUp');
    pressKey(handle, 'Space');

    await waitFor(() => expect(onOrderChange).toHaveBeenCalledWith([ 'amount', 'hash', 'from' ], 'amount'));
  });

  it('reports nothing when a column is dropped where it was picked up', async() => {
    const { onOrderChange, onChange } = renderOpened({ hash: true, from: true, amount: true });

    const handle = await findSortableHandle('From');
    await pickUp(handle);
    pressKey(handle, 'ArrowDown');
    pressKey(handle, 'ArrowUp');
    pressKey(handle, 'Space');

    await waitFor(() => expect(handle.getAttribute('aria-pressed')).not.toBe('true'));
    expect(onOrderChange).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });
});
