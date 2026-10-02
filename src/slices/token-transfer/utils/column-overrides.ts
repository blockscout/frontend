// SPDX-License-Identifier: LicenseRef-Blockscout

import { isPlainObject, omit } from 'es-toolkit';

import type {
  TokenTransferColumnId,
  TokenTransferColumnOverrides,
  TokenTransferColumnOverridesMap,
  TokenTransferSurface,
} from '../types/client';

import { getAvailableColumns, getDefaultColumnIds, SURFACE_COLUMN_STATES, TOKEN_TRANSFER_COLUMNS } from './columns';

const NO_OVERRIDES: TokenTransferColumnOverrides = {};

function isSurface(key: string): key is TokenTransferSurface {
  return Object.hasOwn(SURFACE_COLUMN_STATES, key);
}

function isColumnId(key: string): key is TokenTransferColumnId {
  return TOKEN_TRANSFER_COLUMNS.some(({ id }) => id === key);
}

function parseSurfaceOverrides(value: unknown): TokenTransferColumnOverrides | undefined {
  if (!isPlainObject(value)) {
    return;
  }

  const entries = Object.entries(value).filter(([ key, isVisible ]) => isColumnId(key) && typeof isVisible === 'boolean');
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
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
  const otherColumns = omit(overridesMap[surface] ?? NO_OVERRIDES, [ columnId ]);
  const isDefault = isVisible === (SURFACE_COLUMN_STATES[surface][columnId] === 'on');
  const surfaceOverrides: TokenTransferColumnOverrides = isDefault ? otherColumns : { ...otherColumns, [columnId]: isVisible };

  const otherSurfaces = omit(overridesMap, [ surface ]);
  return Object.keys(surfaceOverrides).length > 0 ? { ...otherSurfaces, [surface]: surfaceOverrides } : otherSurfaces;
}

export function getVisibleColumnIds(
  surface: TokenTransferSurface,
  overrides: TokenTransferColumnOverrides | undefined,
): ReadonlyArray<TokenTransferColumnId> {
  if (!overrides) {
    return getDefaultColumnIds(surface);
  }

  const states = SURFACE_COLUMN_STATES[surface];
  return getAvailableColumns(surface)
    .filter(({ id }) => overrides[id] ?? states[id] === 'on')
    .map(({ id }) => id);
}
