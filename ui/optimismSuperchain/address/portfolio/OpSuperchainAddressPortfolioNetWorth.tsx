import { Center, HStack } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import AdBanner from 'ui/shared/ad/AdBanner';

const OpSuperchainAddressPortfolioNetWorth = () => {
  const isMobile = useIsMobile();

  return (
    <HStack alignItems="stretch" w="full">
      <Center
        minH="100px"
        flexGrow={ 1 }
        bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.100' }}
        borderRadius="base"
      >
        New worth
      </Center>
      { !isMobile && <AdBanner format="mobile" w="fit-content"/> }
    </HStack>
  );
};

export default React.memo(OpSuperchainAddressPortfolioNetWorth);
