import { chakra } from '@chakra-ui/react';
import React from 'react';

import isSelfHosted from 'lib/isSelfHosted';

import CoinzillaTextAd from './CoinzillaTextAd';

const TextAd = ({ className }: {className?: string}) => {
  if (!isSelfHosted()) {
    return null;
  }
  return <CoinzillaTextAd className={ className }/>;
};

export default chakra(TextAd);
