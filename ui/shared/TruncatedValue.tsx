import { chakra } from '@chakra-ui/react';
import type { Placement } from '@floating-ui/dom';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { TruncatedTextTooltip } from 'toolkit/components/truncation/TruncatedTextTooltip';

interface Props {
  className?: string;
  isLoading?: boolean;
  value: string;
  // tooltipContent is used to display the tooltip value different from the truncated value
  tooltipContent?: string;
  tooltipPlacement?: Placement;
  tooltipInteractive?: boolean;
}

const TruncatedValue = ({ className, isLoading, value, tooltipPlacement, tooltipInteractive, tooltipContent }: Props) => {
  const valueElement = (
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
  );

  // if tooltipContent is provided, we display the tooltip content no matter if the value is truncated or not
  if (tooltipContent) {
    return (
      <Tooltip
        content={ tooltipContent }
        positioning={{ placement: tooltipPlacement }}
        interactive={ tooltipInteractive }
      >
        { valueElement }
      </Tooltip>
    );
  };

  return (
    <TruncatedTextTooltip label={ value } placement={ tooltipPlacement } interactive={ tooltipInteractive }>
      { valueElement }
    </TruncatedTextTooltip>
  );
};

export default React.memo(chakra(TruncatedValue));
