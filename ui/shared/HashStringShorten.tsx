import { Tooltip, chakra } from '@chakra-ui/react';
import type { As } from '@chakra-ui/react';
import React from 'react';

import shortenString from 'lib/shortenString';

interface Props {
  hash: string;
  prefix?: string;
  isTooltipDisabled?: boolean;
  as?: As;
}

const HashStringShorten = ({ hash, prefix = '', isTooltipDisabled, as = 'span' }: Props) => {
  if (hash.length <= 8) {
    return <chakra.span as={ as }>{ prefix + hash }</chakra.span>;
  }

  return (
    <Tooltip label={ hash } isDisabled={ isTooltipDisabled }>
      <chakra.span as={ as }>{ prefix + shortenString(hash) }</chakra.span>
    </Tooltip>
  );
};

export default HashStringShorten;
