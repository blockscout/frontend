// SPDX-License-Identifier: LicenseRef-Blockscout

import type BigNumber from 'bignumber.js';
import React from 'react';

import { formatUiMultiplier } from 'src/slices/token/utils/ui-multiplier';

import { Tag, type TagProps } from 'src/toolkit/chakra/tag';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

interface Props extends TagProps {
  multiplier: BigNumber;
}

const TokenMultiplierTag = ({ multiplier, ...rest }: Props) => {
  return (
    <Tooltip content="Token amounts shown are scaled by this factor compared to the raw ERC-20 token amount">
      <Tag { ...rest }>{ formatUiMultiplier(multiplier) }</Tag>
    </Tooltip>
  );
};

export default React.memo(TokenMultiplierTag);
