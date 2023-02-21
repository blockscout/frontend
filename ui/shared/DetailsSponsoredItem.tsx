import { GridItem } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import AdBanner from 'ui/shared/ad/AdBanner';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';

const DetailsSponsoredItem = () => {
  const isMobile = useIsMobile();

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
