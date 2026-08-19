// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import shortenString from 'src/shared/texts/shorten-string';

import { Tooltip } from 'src/toolkit/chakra/tooltip';

interface Props {
  hash: string;
  noTooltip?: boolean;
  tooltipInteractive?: boolean;
  tooltipContent?: React.ReactNode;
  type?: 'long' | 'short';
  maxSymbols?: number;
  as?: React.ElementType;
}

const HashStringShorten = ({ hash, noTooltip, as = 'span', type, tooltipInteractive, tooltipContent, maxSymbols }: Props) => {
  const charNumber = maxSymbols ?? (type === 'long' ? 16 : 8);
  if (hash.length <= charNumber) {
    return <chakra.span as={ as }>{ hash }</chakra.span>;
  }

  const content = <chakra.span as={ as }>{ shortenString(hash, charNumber) }</chakra.span>;

  if (noTooltip) {
    return content;
  }

  return (
    <Tooltip
      contentProps={{ maxW: { base: 'calc(100vw - 8px)', lg: '400px' } }}
      content={ tooltipContent ?? hash }
      interactive={ tooltipInteractive }
    >
      { content }
    </Tooltip>
  );
};

export default HashStringShorten;
