import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { BannerPlatform } from './types';
import type { AdBannerProviders } from 'types/client/adProviders';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';

import AdbutlerBanner from './AdbutlerBanner';
import CoinzillaBanner from './CoinzillaBanner';
import HypeBanner from './HypeBanner';
import SliseBanner from './SliseBanner';

const feature = config.features.adsBanner;

interface Props {
  className?: string;
  isLoading?: boolean;
  platform?: BannerPlatform;
  provider: AdBannerProviders;
}

const AdBannerContent = ({ className, isLoading, provider, platform }: Props) => {
  const content = (() => {
    switch (provider) {
      case 'adbutler':
        return <AdbutlerBanner platform={ platform }/>;
      case 'coinzilla':
        return <CoinzillaBanner platform={ platform }/>;
      case 'hype':
        return <HypeBanner platform={ platform }/>;
      case 'slise':
        return <SliseBanner platform={ platform }/>;
    }
  })();

  return (
    <Skeleton
      className={ className }
      loading={ isLoading }
      borderRadius="none"
      maxW={ ('adButler' in feature && feature.adButler) ? feature.adButler.config.desktop.width : '728px' }
      w="100%"
    >
      { content }
    </Skeleton>
  );
};

export default chakra(AdBannerContent);
