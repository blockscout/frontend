import { Tooltip, chakra } from '@chakra-ui/react';
import type { As } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import shortenString from 'lib/shortenString';

import { isUniversalProfileEnabled } from '../../lib/api/isUniversalProfileEnabled';
import shortenUniversalProfile from '../../lib/shortenUniversalProfile';

interface Props {
  hash: string;
  isTooltipDisabled?: boolean;
  as?: As;
}

const HashStringShorten = ({ hash, isTooltipDisabled, as = 'span' }: Props) => {
  const [ shortenedString, setShortenedString ] = useState(shortenString(hash));
  useEffect(() => {
    if (isUniversalProfileEnabled() && hash.includes(' (')) {
      setShortenedString(shortenUniversalProfile(hash));
    }
  }, [ hash ]);

  if (hash.length <= 8) {
    return <chakra.span as={ as }>{ hash }</chakra.span>;
  }

  return (
    <Tooltip label={ hash } isDisabled={ isTooltipDisabled }>
      <chakra.span as={ as }>{ shortenedString }</chakra.span>
    </Tooltip>
  );
};

export default HashStringShorten;
