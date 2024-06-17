import { chakra } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';

import AdBannerContent from './AdBannerContent';

const feature = config.features.adsBanner;

const AdBanner = ({ className, isLoading }: { className?: string; isLoading?: boolean }) => {
  const provider = useAppContext().adBannerProvider;

  const hasAdblockCookie = cookies.get(cookies.NAMES.ADBLOCK_DETECTED, useAppContext().cookies);

  if (!feature.isEnabled || hasAdblockCookie === 'true' || !provider) {
    return null;
  }

  return (
    <AdBannerContent
      className={ className }
      isLoading={ isLoading }
      provider={ provider }
    />
  );
};

export default chakra(AdBanner);
