import { chakra, Skeleton } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import { useAppContext } from 'lib/appContext';
import * as cookies from 'lib/cookies';
import isSelfHosted from 'lib/isSelfHosted';

import AdbutlerBanner from './AdbutlerBanner';
import CoinzillaBanner from './CoinzillaBanner';

const AdBanner = ({ className, isLoading }: { className?: string; isLoading?: boolean }) => {
  const hasAdblockCookie = cookies.get(cookies.NAMES.ADBLOCK_DETECTED, useAppContext().cookies);

  if (!isSelfHosted() || hasAdblockCookie) {
    return null;
  }

  if (appConfig.ad.adButlerOn) {
    return <Skeleton className={ className } isLoaded={ !isLoading } borderRadius="none"><AdbutlerBanner className={ className }/></Skeleton>;
  }

  return <Skeleton className={ className } isLoaded={ !isLoading } borderRadius="none"><CoinzillaBanner className={ className }/></Skeleton>;
};

export default chakra(AdBanner);
