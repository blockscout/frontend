import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { BannerPlatform } from './types';
import type { AdBannerProviders } from 'types/client/adProviders';

import config from 'configs/app';
import useAccount from 'lib/web3/useAccount';
import { Skeleton } from 'toolkit/chakra/skeleton';

import AdbutlerBanner from './AdbutlerBanner';
import CoinzillaBanner from './CoinzillaBanner';
import HypeBanner from './HypeBanner';
import SliseBanner from './SliseBanner';
import SpecifyBanner from './SpecifyBanner';

const feature = config.features.adsBanner;

interface Props {
  className?: string;
  isLoading?: boolean;
  platform?: BannerPlatform;
  provider: AdBannerProviders;
}

const AdBannerContent = ({ className, isLoading, provider, platform }: Props) => {
  const { address } = useAccount();
  const [ showSpecify, setShowSpecify ] = React.useState(feature.isEnabled && feature.isSpecifyEnabled && Boolean(address));

  React.useEffect(() => {
    if (feature.isEnabled && feature.isSpecifyEnabled && Boolean(address)) {
      setShowSpecify(true);
    } else {
      setShowSpecify(false);
    }
  }, [ address ]);

  const handleEmptySpecify = React.useCallback(() => {
    setShowSpecify(false);
  }, []);

  const content = (() => {
    if (showSpecify) {
      return <SpecifyBanner platform={ platform } address={ address as `0x${ string }` } onEmpty={ handleEmptySpecify }/>;
    }
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
