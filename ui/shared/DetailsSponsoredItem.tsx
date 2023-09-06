import { GridItem } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import * as cookies from 'lib/cookies';
import useIsMobile from 'lib/hooks/useIsMobile';
import AdBanner from 'ui/shared/ad/AdBanner';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';

const feature = config.features.adsBanner;

interface Props {
  isLoading?: boolean;
}

const DetailsSponsoredItem = ({ isLoading }: Props) => {
  const isMobile = useIsMobile();
  const hasAdblockCookie = cookies.get(cookies.NAMES.ADBLOCK_DETECTED);

  if (!feature.isEnabled || hasAdblockCookie) {
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
    <DetailsInfoItem
      title="Sponsored"
      hint="Sponsored banner advertisement"
      isLoading={ isLoading }
    >
      <AdBanner isLoading={ isLoading }/>
    </DetailsInfoItem>
  );
};

export default React.memo(DetailsSponsoredItem);
