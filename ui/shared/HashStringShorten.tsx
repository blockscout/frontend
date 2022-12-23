import { Tooltip } from '@chakra-ui/react';
import React from 'react';

interface Props {
  hash: string;
  isTooltipDisabled?: boolean;
}

const HashStringShorten = ({ hash, isTooltipDisabled }: Props) => {
  return (
    <Tooltip label={ hash } isDisabled={ isTooltipDisabled }>
      { hash.slice(0, 4) + '...' + hash.slice(-4) }
    </Tooltip>
  );
};

export default HashStringShorten;
