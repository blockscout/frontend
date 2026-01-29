import React from 'react';

import config from 'configs/app';
import { Tag, type TagProps } from 'toolkit/chakra/tag';
import { Tooltip } from 'toolkit/chakra/tooltip';

interface Props extends TagProps {}

const NativeTokenTag = (props: Props) => {

  if (!config.UI.views.address.nativeTokenAddress) {
    return null;
  }

  return (
    <Tooltip
      content={ `This ERC-20 token represents the native ${ config.chain.currency.symbol } balance for this address and isn’t counted twice` }
    >
      <Tag { ...props }>Native token</Tag>
    </Tooltip>
  );
};

export default React.memo(NativeTokenTag);
