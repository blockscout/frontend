import { Tooltip, chakra } from '@chakra-ui/react';
import type { As } from '@chakra-ui/react';
import React from 'react';

import shortenString from 'lib/shortenString';

interface Props {
  hash: string;
  isTooltipDisabled?: boolean;
  as?: As;
}

const HashStringShorten = ({ hash, isTooltipDisabled, as = 'span' }: Props) => {
  if (hash.length <= 8) {
    return <chakra.span as={ as }>{ hash }</chakra.span>;
  }

  return (
    <Tooltip label={ hash } isDisabled={ isTooltipDisabled }>
      <chakra.span as={ as }>{ shortenString(hash) }</chakra.span>
    </Tooltip>
  );
};

export default HashStringShorten;
