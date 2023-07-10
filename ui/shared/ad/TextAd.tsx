import { chakra } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';

import CoinzillaTextAd from './CoinzillaTextAd';

const TextAd = ({ className }: {className?: string}) => {
  const hasAdblockCookie = cookies.get(cookies.NAMES.ADBLOCK_DETECTED, useAppContext().cookies);

  if (appConfig.ad.adTextProvider === 'none' || hasAdblockCookie) {
    return null;
  }

  return <CoinzillaTextAd className={ className }/>;
};

export default chakra(TextAd);
