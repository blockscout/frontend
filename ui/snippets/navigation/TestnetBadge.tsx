import { chakra } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  className?: string;
}

const TestnetBadge = ({ className }: Props) => {
  if (!config.chain.isTestnet) {
    return null;
  }

  return <IconSvg className={ className } name="testnet" h="14px" w="37px" color="red.400"/>;
};

export default React.memo(chakra(TestnetBadge));
