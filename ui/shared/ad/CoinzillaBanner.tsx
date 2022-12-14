import { Flex, chakra } from '@chakra-ui/react';
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
  if (isInBrowser) {
    window.coinzilla_display = window.coinzilla_display || [];
    const cDisplayPreferences = {} as CPreferences;
    cDisplayPreferences.zone = '26660bf627543e46851';
    cDisplayPreferences.width = '728';
    cDisplayPreferences.height = '90';
    window.coinzilla_display.push(cDisplayPreferences);
  }

  return (
    <Flex className={ className }>
      <script async src="https://coinzillatag.com/lib/display.js"></script>
      <div className="coinzilla" data-zone="C-26660bf627543e46851"></div>
    </Flex>
  );
};

export default chakra(CoinzillaBanner);
