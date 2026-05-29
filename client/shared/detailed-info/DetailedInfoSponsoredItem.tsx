// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import AdBanner from 'client/features/ads/banner/components/AdBanner';

import config from 'client/config';
import * as cookies from 'client/shared/storage/cookies';

import * as DetailedInfo from './DetailedInfo';

const feature = config.features.adsBanner;

interface Props {
  isLoading?: boolean;
}

const DetailedInfoSponsoredItem = ({ isLoading }: Props) => {
  const hasAdblockCookie = cookies.get(cookies.NAMES.ADBLOCK_DETECTED);

  if (!feature.isEnabled || hasAdblockCookie === 'true') {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Sponsored banner advertisement"
        isLoading={ isLoading }
      >
        Sponsored
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue mt={{ base: 0, lg: 1 }}>
        <AdBanner format="responsive" isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(DetailedInfoSponsoredItem);
