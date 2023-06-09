import { chakra, Skeleton } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import { useAppContext } from 'lib/appContext';
import * as cookies from 'lib/cookies';
import isSelfHosted from 'lib/isSelfHosted';

import AdbutlerBanner from './AdbutlerBanner';
import CoinzillaBanner from './CoinzillaBanner';
import SliseBanner from './SliseBanner';

const AdBanner = ({ className, isLoading }: { className?: string; isLoading?: boolean }) => {
  const hasAdblockCookie = cookies.get(cookies.NAMES.ADBLOCK_DETECTED, useAppContext().cookies);

  if (!isSelfHosted() || hasAdblockCookie) {
    return null;
  }

  const content = (() => {
    if (appConfig.ad.adButlerOn) {
      return <AdbutlerBanner/>;
    }

    if (appConfig.ad.sliseOn) {
      return <SliseBanner/>;
    }

    return <CoinzillaBanner/>;
  })();

  return (
    <Skeleton
      className={ className }
      isLoaded={ !isLoading }
      borderRadius="none"
      maxW={ appConfig.ad.adButlerOn ? '760px' : '728px' }
      w="100%"
    >
      { content }
    </Skeleton>
  );
};

export default chakra(AdBanner);
