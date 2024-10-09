import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { BannerPlatform } from './types';

import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';

import AdBannerContent from './AdBannerContent';

const feature = config.features.adsBanner;

interface Props {
  className?: string;
  isLoading?: boolean;
  platform?: BannerPlatform;
}

const AdBanner = ({ className, isLoading, platform }: Props) => {
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
      platform={ platform }
    />
  );
};

export default chakra(AdBanner);
