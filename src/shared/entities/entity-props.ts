// SPDX-License-Identifier: LicenseRef-Blockscout

import { isUndefined, omitBy } from 'es-toolkit';

import type { IconBaseProps } from './components';
import type { EntityDefaults, EntityIconOptions, EntityOptions, Truncation, TruncationSpec } from './root';

// A key list the compiler checks for completeness: a missing key of `T` turns the result into `{ missingKeys }`,
// which no `ReadonlyArray<keyof T>` accepts. Strings and arrays are outside the mutation gate's scope, unlike a `Record<keyof T, true>`.
export type KeyList<T, K extends ReadonlyArray<keyof T>> = Exclude<keyof T, K[number]> extends never ? K : { missingKeys: Exclude<keyof T, K[number]> };

export function keysOf<T>(): <const K extends ReadonlyArray<keyof T>>(keys: K) => KeyList<T, K> {
  return (keys) => keys as KeyList<T, typeof keys>;
}

export const ENTITY_OPTION_KEY_LIST = keysOf<EntityOptions>()([
  'href', 'icon', 'link', 'query', 'onClick', 'chain', 'isLoading', 'variant',
  'noIcon', 'noCopy', 'noLink', 'noTooltip', 'truncation',
]);

// Splits `props` into the keys listed (defined values only) and everything else.
// The first half is `undefined` when none of the listed keys carries a value, so a caller can tell "no override" from "empty override".
// `TRest` is the caller's statement of what remains; with a generic `TPicked` the compiler cannot derive it from `Omit`.
export function splitByKeys<TPicked extends object, TRest extends object>(
  props: object,
  keys: ReadonlyArray<keyof TPicked>,
): [ Partial<TPicked> | undefined, TRest ] {
  const picked: Partial<TPicked> = {};
  const rest = { ...props } as Record<string, unknown>;
  let hasPicked = false;

  for (const key of keys) {
    const name = key as string;
    const value = rest[name];
    delete rest[name];
    if (value !== undefined) {
      picked[key] = value as TPicked[keyof TPicked];
      hasPicked = true;
    }
  }

  return [ hasPicked ? picked : undefined, rest as TRest ];
}

export function mergeIconOptions(rootIcon: EntityIconOptions | undefined, own: object): IconBaseProps {
  // Both halves are unions over the image / sprite shapes; spreading them as typed values makes the compiler
  // expand a union too large to represent, so the merge is done on the plain object shape.
  return { ...(rootIcon as object), ...own } as IconBaseProps;
}

export function resolveEntityOptions(defaults: EntityDefaults | undefined, options: EntityOptions): EntityOptions {
  const resolved: EntityOptions = { ...defaults, ...omitBy(options, isUndefined) };

  if (defaults?.icon && options.icon) {
    resolved.icon = { ...(defaults.icon as object), ...(options.icon as object) } as EntityIconOptions;
  }

  return resolved;
}

export function mergeEntityData<TData extends object>(rootData: TData | undefined, override: Partial<TData> | undefined): TData {
  // A part composed without a root (an icon alone, a link in a hand-built row) sees only its own override,
  // so an entity definition's functions must tolerate partial data; the resolver guards the hash it reads.
  return { ...rootData, ...override } as TData;
}

export function toTruncationSpec(truncation: Truncation): TruncationSpec {
  return typeof truncation === 'string' ? { type: truncation } : truncation;
}
