// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import config from 'src/config';

import { Tag, type TagProps } from 'src/toolkit/chakra/tag';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

interface Props extends TagProps {
  chainConfig?: typeof config;
}

const NativeTokenTag = ({ chainConfig: chainConfigProp, ...rest }: Props) => {
  const chainConfig = chainConfigProp || config;
  if (!chainConfig.slices.address.nativeTokenAddress) {
    return null;
  }

  return (
    <Tooltip
      content={ `This ERC-20 token represents the native ${ chainConfig.chain.currency.symbol } balance for this address and isn’t counted twice` }
    >
      <Tag { ...rest }>Native token</Tag>
    </Tooltip>
  );
};

export default React.memo(NativeTokenTag);
