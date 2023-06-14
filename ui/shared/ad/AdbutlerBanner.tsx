/* eslint-disable max-len */
import { Flex, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import React from 'react';

import isBrowser from 'lib/isBrowser';
import { connectAdbutler, placeAd, placeAdSPA } from 'ui/shared/ad/adbutlerScript';

const AdbutlerBanner = ({ className }: { className?: string }) => {
  const router = useRouter();
  React.useEffect(() => {
    if (isBrowser()) {
      eval(placeAdSPA);
    }
  }, [ router ]);

  return (
    <Flex className={ className } id="adBanner" h={{ base: '100px', lg: '90px' }}>
      <Script id="ad-butler-1">{ connectAdbutler }</Script>
      <Script id="ad-butler-2">{ placeAd }</Script>
      <div id="ad-banner"></div>
    </Flex>
  );
};

export default chakra(AdbutlerBanner);
