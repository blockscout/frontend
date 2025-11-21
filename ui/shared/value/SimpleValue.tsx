import type { BoxProps } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/react';
import type BigNumber from 'bignumber.js';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';

import { DEFAULT_ACCURACY, formatBnValue } from './utils';

interface Props extends Omit<BoxProps, 'prefix' | 'postfix'> {
  value: BigNumber;
  accuracy?: number;
  prefix?: string;
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
  tooltipContent?: React.ReactNode;
  noTooltip?: boolean;
  loading?: boolean;
  overflowed?: boolean;
}

const SimpleValue = ({
  value,
  accuracy = DEFAULT_ACCURACY,
  prefix,
  startElement,
  endElement,
  tooltipContent,
  noTooltip,
  loading,
  overflowed,
  ...rest
}: Props) => {
  return (
    <Skeleton loading={ loading } display="inline-flex" alignItems="center" whiteSpace="pre" maxW="100%" overflow="hidden" { ...rest }>
      { startElement }
      <Tooltip content={ tooltipContent ?? `${ prefix ?? '' }${ value.toFormat() }` } disabled={ noTooltip }>
        <chakra.span display="inline-block" maxW="100%" overflow="hidden" textOverflow="ellipsis">
          { formatBnValue({ value, accuracy, prefix, overflowed }) }
        </chakra.span>
      </Tooltip>
      { typeof endElement === 'string' ? <span>{ endElement }</span> : endElement }
    </Skeleton>
  );
};

export default React.memo(SimpleValue);
