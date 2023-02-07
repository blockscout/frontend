import { Flex, chakra } from '@chakra-ui/react';
import Script from 'next/script';
import React from 'react';

import isBrowser from 'lib/isBrowser';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    coinzilla_display: any;
  }
}

type CPreferences = {
  zone: string;
  width: string;
  height: string;
}

const CoinzillaBanner = ({ className }: { className?: string }) => {
  const isInBrowser = isBrowser();

  React.useEffect(() => {
    if (isInBrowser) {
      window.coinzilla_display = window.coinzilla_display || [];
      const cDisplayPreferences = {} as CPreferences;
      cDisplayPreferences.zone = '26660bf627543e46851';
      cDisplayPreferences.width = '728';
      cDisplayPreferences.height = '90';
      window.coinzilla_display.push(cDisplayPreferences);
    }
  }, [ isInBrowser ]);

  return (
    <Flex className={ className } id="adBanner" h={{ base: '100px', lg: '90px' }}>
      <Script src="https://coinzillatag.com/lib/display.js"/>
      <div className="coinzilla" data-zone="C-26660bf627543e46851"></div>
    </Flex>
  );
};

export default chakra(CoinzillaBanner);
