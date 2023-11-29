import { Flex, chakra } from '@chakra-ui/react';
import Script from 'next/script';
import React from 'react';

import isBrowser from 'lib/isBrowser';

const CoinzillaBanner = ({ className }: { className?: string }) => {
  const isInBrowser = isBrowser();

  React.useEffect(() => {
    if (isInBrowser) {
      window.coinzilla_display = window.coinzilla_display || [];
      const cDisplayPreferences = {
        zone: '26660bf627543e46851',
        width: '728',
        height: '90',
      };
      window.coinzilla_display.push(cDisplayPreferences);
    }
  }, [ isInBrowser ]);

  return (
    <Flex className={ className } id="adBanner" h={{ base: '100px', lg: '90px' }}>
      <Script strategy="lazyOnload" src="https://coinzillatag.com/lib/display.js"/>
      <div className="coinzilla" data-zone="C-26660bf627543e46851"></div>
    </Flex>
  );
};

export default chakra(CoinzillaBanner);
