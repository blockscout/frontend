// SPDX-License-Identifier: LicenseRef-Blockscout

import { isEqual, isPlainObject, omit, uniq } from 'es-toolkit';

import type { ColumnOverrides, ColumnStates, ColumnVisibility, TableColumn } from './types';

const NO_VISIBILITY: ColumnVisibility<string> = {};

type ColumnIdGuard<TColumnId extends string> = (key: unknown) => key is TColumnId;

function parseVisibility<TColumnId extends string>(
  value: unknown,
  isColumnId: ColumnIdGuard<TColumnId>,
): ColumnVisibility<TColumnId> | undefined {
  if (!isPlainObject(value)) {
    return;
  }

  const entries = Object.entries(value).filter(([ key, isVisible ]) => isColumnId(key) && typeof isVisible === 'boolean');
  return entries.length > 0 ? Object.fromEntries(entries) as ColumnVisibility<TColumnId> : undefined;
}

function parseOrder<TColumnId extends string>(
  value: unknown,
  isColumnId: ColumnIdGuard<TColumnId>,
): ReadonlyArray<TColumnId> | undefined {
  if (!Array.isArray(value)) {
    return;
  }

  const order = uniq(value.filter(isColumnId));
  return order.length > 0 ? order : undefined;
}

function buildOverrides<TColumnId extends string>(
  visibility: ColumnVisibility<TColumnId> | undefined,
  order: ReadonlyArray<TColumnId> | undefined,
): ColumnOverrides<TColumnId> | undefined {
  const hasVisibility = visibility !== undefined && Object.keys(visibility).length > 0;
  if (!hasVisibility && !order) {
    return;
  }

  return {
    ...(hasVisibility ? { visibility } : {}),
    ...(order ? { order } : {}),
  };
}

export function parseColumnOverrides<TColumnId extends string>(
  rawValue: string | null,
  columnIds: ReadonlyArray<TColumnId>,
): ColumnOverrides<TColumnId> | undefined {
  if (!rawValue) {
    return;
  }

  const isColumnId = (key: unknown): key is TColumnId => columnIds.includes(key as TColumnId);

  try {
    const parsed: unknown = JSON.parse(rawValue);
    if (!isPlainObject(parsed)) {
      return;
    }

    return buildOverrides(parseVisibility(parsed.visibility, isColumnId), parseOrder(parsed.order, isColumnId));
  } catch {
    return;
  }
}

export function serializeColumnOverrides<TColumnId extends string>(overrides: ColumnOverrides<TColumnId>): string {
  return JSON.stringify(overrides);
}

export function getAvailableColumns<TColumn extends TableColumn<TColumnId>, TColumnId extends string = TColumn['id']>(
  columns: ReadonlyArray<TColumn>,
  states: ColumnStates<NoInfer<TColumnId>>,
): ReadonlyArray<TColumn> {
  return columns.filter(({ id }) => states[id] !== 'unavailable');
}

export function getDefaultColumnIds<TColumn extends TableColumn<TColumnId>, TColumnId extends string = TColumn['id']>(
  columns: ReadonlyArray<TColumn>,
  states: ColumnStates<NoInfer<TColumnId>>,
): ReadonlyArray<TColumnId> {
  return columns.filter(({ id }) => states[id] === 'on').map(({ id }) => id);
}

export function getOrderedColumns<TColumn extends TableColumn<TColumnId>, TColumnId extends string = TColumn['id']>(
  availableColumns: ReadonlyArray<TColumn>,
  order: ReadonlyArray<NoInfer<TColumnId>> | undefined,
): ReadonlyArray<TColumn> {
  if (!order) {
    return availableColumns;
  }

  const orderedColumns = order
    .map((id) => availableColumns.find((column) => column.id === id))
    .filter((column) => column !== undefined);

  availableColumns.forEach((column, defaultIndex) => {
    if (order.includes(column.id)) {
      return;
    }

    const precedingColumn = availableColumns.slice(0, defaultIndex).findLast((item) => orderedColumns.includes(item));
    orderedColumns.splice(precedingColumn ? orderedColumns.indexOf(precedingColumn) + 1 : 0, 0, column);
  });

  return orderedColumns;
}

export function getVisibleColumnIds<TColumn extends TableColumn<TColumnId>, TColumnId extends string = TColumn['id']>(
  availableColumns: ReadonlyArray<TColumn>,
  states: ColumnStates<NoInfer<TColumnId>>,
  overrides: ColumnOverrides<NoInfer<TColumnId>> | undefined,
): ReadonlyArray<TColumnId> {
  const visibility: ColumnVisibility<TColumnId> = overrides?.visibility ?? NO_VISIBILITY;
  return getOrderedColumns(availableColumns, overrides?.order)
    .filter(({ id }) => visibility[id] ?? states[id] === 'on')
    .map(({ id }) => id);
}

export function setColumnVisibility<TColumnId extends string>(
  overrides: ColumnOverrides<NoInfer<TColumnId>> | undefined,
  states: ColumnStates<TColumnId>,
  columnId: NoInfer<TColumnId>,
  isVisible: boolean,
): ColumnOverrides<TColumnId> | undefined {
  const currentVisibility: ColumnVisibility<TColumnId> = overrides?.visibility ?? NO_VISIBILITY;
  const otherColumns = omit(currentVisibility, [ columnId ]) as ColumnVisibility<TColumnId>;
  const isDefault = isVisible === (states[columnId] === 'on');
  const visibility: ColumnVisibility<TColumnId> = isDefault ? otherColumns : { ...otherColumns, [columnId]: isVisible };

  return buildOverrides(visibility, overrides?.order);
}

export function setColumnOrder<TColumn extends TableColumn<TColumnId>, TColumnId extends string = TColumn['id']>(
  overrides: ColumnOverrides<NoInfer<TColumnId>> | undefined,
  availableColumns: ReadonlyArray<TColumn>,
  order: ReadonlyArray<NoInfer<TColumnId>>,
): ColumnOverrides<TColumnId> | undefined {
  const nextOrder = getOrderedColumns(availableColumns, order).map(({ id }) => id);
  const isDefault = isEqual(nextOrder, availableColumns.map(({ id }) => id));

  return buildOverrides(overrides?.visibility, isDefault ? undefined : nextOrder);
}
