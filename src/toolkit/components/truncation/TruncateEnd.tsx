// SPDX-License-Identifier: LicenseRef-Blockscout

// End-ellipsis truncation driven by container width via CSS `text-overflow: ellipsis`.
// A tooltip is shown only when the text actually overflows, measured by OverflowTooltip.

import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { TruncateBaseProps } from './types';

import { Skeleton } from '../../chakra/skeleton';
import { OverflowTooltip } from './OverflowTooltip';

export type TruncateEndProps = TruncateBaseProps;

const TruncateEnd = ({ value, as = 'span', loading, tooltip, ...styleProps }: TruncateEndProps) => {
  const valueElement = (
    <Skeleton
      loading={ loading }
      display="inline-block"
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
      height="fit-content"
      { ...styleProps }
    >
      <chakra.span as={ as }>{ value }</chakra.span>
    </Skeleton>
  );

  if (tooltip === false) {
    return valueElement;
  }

  return (
    <OverflowTooltip label={ tooltip?.content ?? value } placement={ tooltip?.placement } interactive={ tooltip?.interactive }>
      { valueElement }
    </OverflowTooltip>
  );
};

export default TruncateEnd;
