// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { BannerFormat } from './types';
import type { AdBannerProviders } from 'types/client/adProviders';

import useProfileQuery from 'client/features/account/hooks/useProfileQuery';
import useAccount from 'client/features/connect-wallet/hooks/useAccount';

import config from 'configs/app';
import { Skeleton } from 'toolkit/chakra/skeleton';

import AdbutlerBanner from './AdbutlerBanner';
import { DESKTOP_BANNER_WIDTH, MOBILE_BANNER_WIDTH } from './consts';
import SevioBanner from './SevioBanner';
import SliseBanner from './SliseBanner';
import SpecifyBanner from './SpecifyBanner';

const feature = config.features.adsBanner;
const isSpecifyEnabled = feature.isEnabled && feature.isSpecifyEnabled;

interface Props {
  className?: string;
  isLoading?: boolean;
  format?: BannerFormat;
  provider: AdBannerProviders;
}

const AdBannerContent = ({ className, isLoading, provider, format }: Props) => {
  const { address: addressWC, isConnecting } = useAccount();
  const profileQuery = useProfileQuery();
  const [ showSpecify, setShowSpecify ] = React.useState(isSpecifyEnabled);

  const handleEmptySpecify = React.useCallback(() => {
    setShowSpecify(false);
  }, []);

  const address = addressWC || profileQuery.data?.address_hash as `0x${ string }` | undefined;

  const content = (() => {
    if (showSpecify) {
      const isLoading = address ? false : profileQuery.isLoading || isConnecting;
      return <SpecifyBanner format={ format } address={ address } onEmpty={ handleEmptySpecify } isLoading={ isLoading }/>;
    }
    switch (provider) {
      case 'adbutler':
        return <AdbutlerBanner format={ format }/>;
      case 'sevio':
        return <SevioBanner format={ format }/>;
      case 'slise':
        return <SliseBanner format={ format }/>;
    }
  })();

  return (
    <Skeleton
      className={ className }
      loading={ isLoading }
      borderRadius="none"
      maxW={{ base: `${ MOBILE_BANNER_WIDTH }px`, lg: `${ DESKTOP_BANNER_WIDTH }px` }}
      w="100%"
    >
      { content }
    </Skeleton>
  );
};

export default chakra(AdBannerContent);
