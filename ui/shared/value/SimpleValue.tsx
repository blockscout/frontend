import type { BoxProps } from '@chakra-ui/react';
import { chakra, Flex } from '@chakra-ui/react';
import type BigNumber from 'bignumber.js';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

import { DEFAULT_ACCURACY, formatBnValue } from './utils';

export interface Props extends Omit<BoxProps, 'prefix' | 'postfix'> {
  value: BigNumber;
  accuracy?: number;
  prefix?: string;
  postfix?: string;
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
  postfix,
  startElement,
  endElement,
  tooltipContent: tooltipContentProp,
  noTooltip,
  loading,
  overflowed,
  ...rest
}: Props) => {

  const tooltipContent = React.useMemo(() => {
    const content = tooltipContentProp ?? `${ prefix ?? '' }${ value.toFormat() }${ postfix ?? '' }`;

    return (
      <Flex alignItems="center">
        { content }
        <CopyToClipboard text={ value.toString() } noTooltip/>
      </Flex>
    );
  }, [ postfix, prefix, tooltipContentProp, value ]);

  return (
    <Skeleton loading={ loading } display="inline-flex" alignItems="center" whiteSpace="pre" maxW="100%" overflow="hidden" { ...rest }>
      { startElement }
      <Tooltip content={ tooltipContent } disabled={ noTooltip } interactive>
        <chakra.span display="inline-block" maxW="100%" overflow="hidden" textOverflow="ellipsis">
          { formatBnValue({ value, accuracy, prefix, postfix, overflowed }) }
        </chakra.span>
      </Tooltip>
      { typeof endElement === 'string' ? <span>{ endElement }</span> : endElement }
    </Skeleton>
  );
};

export default React.memo(SimpleValue);
