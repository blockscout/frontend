// SPDX-License-Identifier: LicenseRef-Blockscout

// Middle-ellipsis truncation by a fixed character count — a pure string slice with no DOM
// measurement. SSR-safe and the cheapest option, so it is the default for high-traffic hashes
// (every hash in every table row). "Truncated" here means value.length > maxSymbols.

import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { TruncateBaseProps } from './types';

import { Skeleton } from '../../chakra/skeleton';
import { Tooltip } from '../../chakra/tooltip';
import { shortenString } from '../../utils/texts';

const DEFAULT_MAX_SYMBOLS = 8;

export interface TruncateMiddleStaticProps extends TruncateBaseProps {
  maxSymbols?: number;
}

export const TruncateMiddleStatic = React.memo(({
  value,
  maxSymbols = DEFAULT_MAX_SYMBOLS,
  as = 'span',
  loading,
  tooltip,
  ...styleProps
}: TruncateMiddleStaticProps) => {
  const isTruncated = value.length > maxSymbols;
  const displayed = isTruncated ? shortenString(value, maxSymbols) : value;

  const content = (
    <Skeleton loading={ loading } asChild>
      <chakra.span as={ as } { ...styleProps }>{ displayed }</chakra.span>
    </Skeleton>
  );

  if (tooltip === false || (!isTruncated && !tooltip?.always)) {
    return content;
  }

  return (
    <Tooltip
      content={ tooltip?.content ?? value }
      contentProps={{ maxW: { base: 'calc(100vw - 8px)', lg: '400px' } }}
      positioning={ tooltip?.positioning }
      interactive={ tooltip?.interactive }
    >
      { content }
    </Tooltip>
  );
});
