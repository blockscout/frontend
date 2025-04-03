import { GridItem } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import * as cookies from 'lib/cookies';
import useIsMobile from 'lib/hooks/useIsMobile';
import AdBanner from 'ui/shared/ad/AdBanner';

import * as DetailedInfo from './DetailedInfo';

const feature = config.features.adsBanner;

interface Props {
  isLoading?: boolean;
}

const DetailedInfoSponsoredItem = ({ isLoading }: Props) => {
  const isMobile = useIsMobile();
  const hasAdblockCookie = cookies.get(cookies.NAMES.ADBLOCK_DETECTED);

  if (!feature.isEnabled || hasAdblockCookie === 'true') {
    return null;
  }

  if (isMobile) {
    return (
      <GridItem mt={ 5 }>
        <AdBanner mx="auto" isLoading={ isLoading } display="flex" justifyContent="center"/>
      </GridItem>
    );
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Sponsored banner advertisement"
        isLoading={ isLoading }
      >
        Sponsored
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <AdBanner isLoading={ isLoading }/>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(DetailedInfoSponsoredItem);
