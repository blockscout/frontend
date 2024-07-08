import { Flex, chakra } from '@chakra-ui/react';
import Script from 'next/script';
import React from 'react';

import type { BannerProps } from './types';

import isBrowser from 'lib/isBrowser';

const CoinzillaBanner = ({ className, platform }: BannerProps) => {
  const isInBrowser = isBrowser();

  const { width, height } = (() => {
    switch (platform) {
      case 'desktop':
        return { width: 728, height: 90 };
      case 'mobile':
        return { width: 320, height: 100 };
      default:
        return { width: undefined, height: undefined };
    }

  })();

  React.useEffect(() => {
    if (isInBrowser) {
      window.coinzilla_display = window.coinzilla_display || [];
      const cDisplayPreferences = {
        zone: '26660bf627543e46851',
        width: width ? String(width) : '728',
        height: height ? String(height) : '90',
      };
      window.coinzilla_display.push(cDisplayPreferences);
    }
  }, [ height, isInBrowser, width ]);

  return (
    <Flex
      className={ className }
      id={ 'adBanner' + (platform ? `_${ platform }` : '') }
      h={ height ? `${ height }px` : { base: '100px', lg: '90px' } }
      w={ width ? `${ width }px` : undefined }
    >
      <Script strategy="lazyOnload" src="https://coinzillatag.com/lib/display.js"/>
      <div className="coinzilla" data-zone="C-26660bf627543e46851"></div>
    </Flex>
  );
};

export default chakra(CoinzillaBanner);
