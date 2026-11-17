// SPDX-License-Identifier: LicenseRef-Blockscout

import type { SystemStyleObject } from '@chakra-ui/react';
import { useChakraContext } from '@chakra-ui/react';
import { isUndefined, omitBy } from 'es-toolkit';

export type WithoutCssProps<T> = T extends unknown ? Omit<T, keyof SystemStyleObject> : never;

export function useSplitCssProps<T extends object>(props: T): [ SystemStyleObject, WithoutCssProps<T> ] {
  const { splitCssProps } = useChakraContext();
  const [ css, rest ] = splitCssProps(props as SystemStyleObject);

  return [ omitBy(css, isUndefined), rest as WithoutCssProps<T> ];
}
