import { Flex, chakra } from '@chakra-ui/react';
import { SliseAd } from '@slise/embed-react';
import React from 'react';

import appConfig from 'configs/app/config';

const SliseBanner = ({ className }: { className?: string }) => {

  return (
    <>
      <Flex className={ className } h="90px" display={{ base: 'none', lg: 'flex' }}>
        <SliseAd
          slotId={ appConfig.network.name || '' }
          pub="pub-10"
          format="728x90"
          style={{ width: '728px', height: '90px' }}/>
      </Flex>
      <Flex className={ className } h="90px" display={{ base: 'flex', lg: 'none' }}>
        <SliseAd
          slotId={ appConfig.network.name || '' }
          pub="pub-10"
          format="270x90"
          style={{ width: '270px', height: '90px' }}/>
      </Flex>
    </>
  );
};

export default chakra(SliseBanner);
