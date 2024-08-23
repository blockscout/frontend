import { GridItem } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import * as cookies from 'lib/cookies';
import useIsMobile from 'lib/hooks/useIsMobile';
// import AdBanner from 'ui/shared/ad/AdBanner';
// import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';

const feature = config.features.adsBanner;

interface Props {
  isLoading?: boolean;
}

const DetailsSponsoredItem = ({ }: Props) => {
  const isMobile = useIsMobile();
  const hasAdblockCookie = cookies.get(cookies.NAMES.ADBLOCK_DETECTED);

  if (!feature.isEnabled || hasAdblockCookie === 'true') {
    return null;
  }

  if (isMobile) {
    return (
      <GridItem mt={ 5 }>
        { /* <AdBanner mx="auto" isLoading={ isLoading } display="flex" justifyContent="center"/> */ }
      </GridItem>
    );
  }

  // return (
  //   <>
  //     <DetailsInfoItem.Label
  //       hint="Sponsored banner advertisement"
  //       isLoading={ isLoading }
  //     >
  //       Sponsored
  //     </DetailsInfoItem.Label>
  //     <DetailsInfoItem.Value>
  //       <AdBanner isLoading={ isLoading }/>
  //     </DetailsInfoItem.Value>
  //   </>
  // );
  return null;
};

export default React.memo(DetailsSponsoredItem);
