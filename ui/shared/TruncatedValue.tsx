import { chakra } from '@chakra-ui/react';
import type { Placement } from '@floating-ui/dom';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { TruncatedTextTooltip } from 'toolkit/components/truncation/TruncatedTextTooltip';

interface Props {
  className?: string;
  isLoading?: boolean;
  value: string;
  tooltipPlacement?: Placement;
  tooltipInteractive?: boolean;
}

const TruncatedValue = ({ className, isLoading, value, tooltipPlacement, tooltipInteractive }: Props) => {
  return (
    <TruncatedTextTooltip label={ value } placement={ tooltipPlacement } interactive={ tooltipInteractive }>
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
