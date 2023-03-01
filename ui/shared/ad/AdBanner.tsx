import { chakra } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import { useAppContext } from 'lib/appContext';
import * as cookies from 'lib/cookies';
import isSelfHosted from 'lib/isSelfHosted';

import AdbutlerBanner from './AdbutlerBanner';
import CoinzillaBanner from './CoinzillaBanner';

const AdBanner = ({ className }: { className?: string }) => {
  const hasAdblockCookie = cookies.get(cookies.NAMES.ADBLOCK_DETECTED, useAppContext().cookies);

  if (!isSelfHosted() || hasAdblockCookie) {
    return null;
  }

  if (appConfig.ad.adButlerOn) {
    return <AdbutlerBanner className={ className }/>;
  }

  return <CoinzillaBanner className={ className }/>;
};

export default chakra(AdBanner);
