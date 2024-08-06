import { chakra } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import colors from 'theme/foundations/colors';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  className?: string;
}

const TestnetBadge = ({ className }: Props) => {
  if (!config.chain.isTestnet) {
    return null;
  }

  return <IconSvg className={ className } name="testnet" h="14px" w="37px" color={ colors.error[500] }/>;
};

export default React.memo(chakra(TestnetBadge));
