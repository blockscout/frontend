// SPDX-License-Identifier: LicenseRef-Blockscout

import { isEqual, isPlainObject, omit, uniq } from 'es-toolkit';

import type {
  TokenTransferColumn,
  TokenTransferColumnId,
  TokenTransferColumnOverrides,
  TokenTransferColumnOverridesMap,
  TokenTransferColumnVisibility,
  TokenTransferSurface,
} from '../types/client';

import { getAvailableColumns, getDefaultColumnIds, SURFACE_COLUMN_STATES, TOKEN_TRANSFER_COLUMNS } from './columns';

const NO_VISIBILITY: TokenTransferColumnVisibility = {};

function isSurface(key: string): key is TokenTransferSurface {
  return Object.hasOwn(SURFACE_COLUMN_STATES, key);
}

function isColumnId(key: unknown): key is TokenTransferColumnId {
  return TOKEN_TRANSFER_COLUMNS.some(({ id }) => id === key);
}

function parseVisibility(value: unknown): TokenTransferColumnVisibility | undefined {
  if (!isPlainObject(value)) {
    return;
  }

  const entries = Object.entries(value).filter(([ key, isVisible ]) => isColumnId(key) && typeof isVisible === 'boolean');
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

function parseOrder(value: unknown): ReadonlyArray<TokenTransferColumnId> | undefined {
  if (!Array.isArray(value)) {
    return;
  }

  const order = uniq(value.filter(isColumnId));
  return order.length > 0 ? order : undefined;
}

function buildSurfaceOverrides(
  visibility: TokenTransferColumnVisibility | undefined,
  order: ReadonlyArray<TokenTransferColumnId> | undefined,
): TokenTransferColumnOverrides | undefined {
  const hasVisibility = visibility !== undefined && Object.keys(visibility).length > 0;
  if (!hasVisibility && !order) {
    return;
  }

  return {
    ...(hasVisibility ? { visibility } : {}),
    ...(order ? { order } : {}),
  };
}

function parseSurfaceOverrides(value: unknown): TokenTransferColumnOverrides | undefined {
  if (!isPlainObject(value)) {
    return;
  }

  return buildSurfaceOverrides(parseVisibility(value.visibility), parseOrder(value.order));
}

function setSurfaceOverrides(
  overridesMap: TokenTransferColumnOverridesMap,
  surface: TokenTransferSurface,
  overrides: TokenTransferColumnOverrides | undefined,
): TokenTransferColumnOverridesMap {
  const otherSurfaces = omit(overridesMap, [ surface ]);
  return overrides ? { ...otherSurfaces, [surface]: overrides } : otherSurfaces;
}

export function parseColumnOverrides(cookieValue: string | undefined): TokenTransferColumnOverridesMap {
  if (!cookieValue) {
    return {};
  }

  try {
    // the server reads the raw cookie header, where js-cookie keeps quotes and commas percent-encoded
    const parsed: unknown = JSON.parse(decodeURIComponent(cookieValue));
    if (!isPlainObject(parsed)) {
      return {};
    }

    const result: TokenTransferColumnOverridesMap = {};
    Object.entries(parsed).forEach(([ key, value ]) => {
      if (!isSurface(key)) {
        return;
      }
      const overrides = parseSurfaceOverrides(value);
      if (overrides) {
        result[key] = overrides;
      }
    });
    return result;
  } catch {
    return {};
  }
}

export function serializeColumnOverrides(overridesMap: TokenTransferColumnOverridesMap): string {
  return JSON.stringify(overridesMap);
}

export function setColumnVisibility(
  overridesMap: TokenTransferColumnOverridesMap,
  surface: TokenTransferSurface,
  columnId: TokenTransferColumnId,
  isVisible: boolean,
): TokenTransferColumnOverridesMap {
  const surfaceOverrides = overridesMap[surface];
  const otherColumns = omit(surfaceOverrides?.visibility ?? NO_VISIBILITY, [ columnId ]);
  const isDefault = isVisible === (SURFACE_COLUMN_STATES[surface][columnId] === 'on');
  const visibility: TokenTransferColumnVisibility = isDefault ? otherColumns : { ...otherColumns, [columnId]: isVisible };

  return setSurfaceOverrides(overridesMap, surface, buildSurfaceOverrides(visibility, surfaceOverrides?.order));
}

export function getOrderedColumns(
  surface: TokenTransferSurface,
  order: ReadonlyArray<TokenTransferColumnId> | undefined,
): ReadonlyArray<TokenTransferColumn> {
  const availableColumns = getAvailableColumns(surface);
  if (!order) {
    return availableColumns;
  }

  const storedColumns = order
    .map((id) => availableColumns.find((column) => column.id === id))
    .filter((column) => column !== undefined);
  const missingColumns = availableColumns.filter((column) => !order.includes(column.id));
  return [ ...storedColumns, ...missingColumns ];
}

export function setColumnOrder(
  overridesMap: TokenTransferColumnOverridesMap,
  surface: TokenTransferSurface,
  order: ReadonlyArray<TokenTransferColumnId>,
): TokenTransferColumnOverridesMap {
  const nextOrder = getOrderedColumns(surface, order).map(({ id }) => id);
  const isDefault = isEqual(nextOrder, getAvailableColumns(surface).map(({ id }) => id));

  return setSurfaceOverrides(
    overridesMap,
    surface,
    buildSurfaceOverrides(overridesMap[surface]?.visibility, isDefault ? undefined : nextOrder),
  );
}

export function getVisibleColumnIds(
  surface: TokenTransferSurface,
  overrides: TokenTransferColumnOverrides | undefined,
): ReadonlyArray<TokenTransferColumnId> {
  if (!overrides) {
    return getDefaultColumnIds(surface);
  }

  const states = SURFACE_COLUMN_STATES[surface];
  const visibility = overrides.visibility ?? NO_VISIBILITY;
  return getOrderedColumns(surface, overrides.order)
    .filter(({ id }) => visibility[id] ?? states[id] === 'on')
    .map(({ id }) => id);
}
