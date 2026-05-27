// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';
import React from 'react';

import { Tag, type TagProps } from 'toolkit/chakra/tag';
import { Tooltip } from 'toolkit/chakra/tooltip';

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
