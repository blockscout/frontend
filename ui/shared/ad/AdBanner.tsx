import { chakra, Skeleton } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';

import AdbutlerBanner from './AdbutlerBanner';
import CoinzillaBanner from './CoinzillaBanner';
import SliseBanner from './SliseBanner';

const AdBanner = ({ className, isLoading }: { className?: string; isLoading?: boolean }) => {
  const hasAdblockCookie = cookies.get(cookies.NAMES.ADBLOCK_DETECTED, useAppContext().cookies);

  if (!config.features.adsBanner.isEnabled || hasAdblockCookie) {
    return null;
  }

  const content = (() => {
    switch (config.features.adsBanner.provider) {
      case 'adbutler':
        return <AdbutlerBanner/>;
      case 'coinzilla':
        return <CoinzillaBanner/>;
      case 'slise':
        return <SliseBanner/>;
    }
  })();

  return (
    <Skeleton
      className={ className }
      isLoaded={ !isLoading }
      borderRadius="none"
      maxW={ config.features.adsBanner.provider === 'adbutler' ? config.features.adsBanner.adButler.config.desktop?.width : '728px' }
      w="100%"
    >
      { content }
    </Skeleton>
  );
};

export default chakra(AdBanner);
