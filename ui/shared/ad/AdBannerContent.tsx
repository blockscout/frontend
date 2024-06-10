import { chakra, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { AdBannerProviders } from 'types/client/adProviders';

import config from 'configs/app';

import AdbutlerBanner from './AdbutlerBanner';
import CoinzillaBanner from './CoinzillaBanner';
import GetitBanner from './GetitBanner';
import HypeBanner from './HypeBanner';
import SliseBanner from './SliseBanner';

const feature = config.features.adsBanner;

const AdBannerContent = ({ className, isLoading, provider }: { className?: string; isLoading?: boolean; provider: AdBannerProviders }) => {
  const content = (() => {
    switch (provider) {
      case 'adbutler':
        return <AdbutlerBanner/>;
      case 'coinzilla':
        return <CoinzillaBanner/>;
      case 'getit':
        return <GetitBanner/>;
      case 'hype':
        return <HypeBanner/>;
      case 'slise':
        return <SliseBanner/>;
    }
  })();

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

export default chakra(AdBannerContent);
