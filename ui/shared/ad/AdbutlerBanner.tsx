/* eslint-disable max-len */
import { Flex, chakra } from '@chakra-ui/react';
import Script from 'next/script';
import React from 'react';

import { connectAdbutler, placeAd } from 'ui/shared/ad/adbutlerScript';

const AdbutlerBanner = ({ className }: { className?: string }) => {
  return (
    <Flex className={ className } id="adBanner" h={{ base: '100px', lg: '90px' }}>
      <div id="ad-banner"></div>
      <Script id="ad-butler-1">{ connectAdbutler }</Script>
      <Script id="ad-butler-2">{ placeAd }</Script>
    </Flex>
  );
};

export default chakra(AdbutlerBanner);
