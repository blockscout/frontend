import { Flex, chakra } from '@chakra-ui/react';
import { SliseAd } from '@slise/embed-react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';

const SliseBanner = ({ className }: { className?: string }) => {
  const isMobile = useIsMobile();
  return (
    <Flex className={ className } h="90px">
      <SliseAd
        slotId="leaderboard"
        pub="pub-10"
        format={ isMobile ? '270x90' : '728x90' }
        style={{ width: isMobile ? '270px' : '728px', height: '90px' }}/>
    </Flex>
  );
};

export default chakra(SliseBanner);
