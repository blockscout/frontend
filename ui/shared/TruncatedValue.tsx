import { chakra } from '@chakra-ui/react';
import type { Placement } from '@floating-ui/dom';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';
import TruncatedTextTooltip from 'ui/shared/TruncatedTextTooltip';

interface Props {
  className?: string;
  isLoading?: boolean;
  value: string;
  tooltipPlacement?: Placement;
}

const TruncatedValue = ({ className, isLoading, value, tooltipPlacement }: Props) => {
  return (
    <TruncatedTextTooltip label={ value } placement={ tooltipPlacement }>
      <Skeleton
        className={ className }
        loading={ isLoading }
        display="inline-block"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        height="fit-content"
      >
        <span>{ value }</span>
      </Skeleton>
    </TruncatedTextTooltip>
  );
};

export default React.memo(chakra(TruncatedValue));
