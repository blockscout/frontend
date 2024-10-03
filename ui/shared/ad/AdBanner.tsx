import { chakra, Skeleton } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';

import AdbutlerBanner from './AdbutlerBanner';
import CoinzillaBanner from './CoinzillaBanner';
import GetitBanner from './GetitBanner';
import HypeBanner from './HypeBanner';
import SliseBanner from './SliseBanner';

const feature = config.features.adsBanner;

const AdBanner = ({ className, isLoading }: { className?: string; isLoading?: boolean }) => {
  const provider = useAppContext().adBannerProvider;

  const hasAdblockCookie = cookies.get(cookies.NAMES.ADBLOCK_DETECTED, useAppContext().cookies);

  if (!feature.isEnabled || hasAdblockCookie || !provider) {
    return null;
  }

  // const content = (() => {
  //   switch (provider) {
  //     case 'adbutler':
  //       return <AdbutlerBanner/>;
  //     case 'coinzilla':
  //       return <CoinzillaBanner/>;
  //     case 'getit':
  //       return <GetitBanner/>;
  //     case 'hype':
  //       return <HypeBanner/>;
  //     case 'slise':
  //       return <SliseBanner/>;
  //   }
  // })();

  const content = <></>

  return (
    <Skeleton
      className={ className }
      isLoaded={ !isLoading }
      borderRadius="none"
      maxW={ ('adButler' in feature && feature.adButler) ? feature.adButler.config.desktop.width : '728px' }
      w="100%"
    >
      { content }
    </Skeleton>
  );
};

export default chakra(AdBanner);
