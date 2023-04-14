import { GridItem } from '@chakra-ui/react';
import React from 'react';

import * as cookies from 'lib/cookies';
import useIsMobile from 'lib/hooks/useIsMobile';
import isSelfHosted from 'lib/isSelfHosted';
import AdBanner from 'ui/shared/ad/AdBanner';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';

interface Props {
  isLoading?: boolean;
}

const DetailsSponsoredItem = ({ isLoading }: Props) => {
  const isMobile = useIsMobile();
  const hasAdblockCookie = cookies.get(cookies.NAMES.ADBLOCK_DETECTED);

  if (!isSelfHosted() || hasAdblockCookie) {
    return null;
  }

  if (isMobile) {
    return (
      <GridItem mt={ 5 }>
        <AdBanner justifyContent="center" isLoading={ isLoading }/>
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
