import { GridItem } from '@chakra-ui/react';
import React from 'react';

import * as cookies from 'lib/cookies';
import useIsMobile from 'lib/hooks/useIsMobile';
import AdBanner from 'ui/shared/ad/AdBanner';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';

const DetailsSponsoredItem = () => {
  const isMobile = useIsMobile();
  const hasAdblockCookie = cookies.get(cookies.NAMES.ADBLOCK_DETECTED);

  if (hasAdblockCookie) {
    return null;
  }

  if (isMobile) {
    return (
      <GridItem mt={ 5 }>
        <AdBanner justifyContent="center"/>
      </GridItem>
    );
  }

  return (
    <DetailsInfoItem
      title="Sponsored"
      hint="Sponsored banner advertisement"
    >
      <AdBanner/>
    </DetailsInfoItem>
  );
};

export default React.memo(DetailsSponsoredItem);
