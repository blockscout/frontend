import { Flex, chakra } from '@chakra-ui/react';
import Script from 'next/script';
import React from 'react';

import type { BannerProps } from './types';

import useIsMobile from 'lib/hooks/useIsMobile';
import { isBrowser } from 'toolkit/utils/isBrowser';

const CoinzillaBanner = ({ className, platform }: BannerProps) => {
  const isInBrowser = isBrowser();
  const isMobileViewport = useIsMobile();

  // On the home page there are two ad banners
  //  - one in the stats section with prop "platform === mobile", should be hidden on mobile devices
  //  - another - a regular ad banner, should be hidden on desktop devices
  // The Coinzilla provider doesn't work properly with 2 banners with the same id on the page
  // So we use this flag to skip ad initialization for the first home page banner on mobile devices
  // For all other pages this is not the case
  const isHidden = (isMobileViewport && platform === 'mobile');

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
    if (isInBrowser && !isHidden) {
      window.coinzilla_display = window.coinzilla_display || [];
      const cDisplayPreferences = {
        zone: '26660bf627543e46851',
        width: width ? String(width) : '728',
        height: height ? String(height) : '90',
      };
      window.coinzilla_display.push(cDisplayPreferences);
    }
  }, [ height, isInBrowser, isHidden, width ]);

  return (
    <Flex
      className={ className }
      id={ 'adBanner' + (platform ? `_${ platform }` : '') }
      h={ height ? `${ height }px` : { base: '100px', lg: '90px' } }
      w={ width ? `${ width }px` : undefined }
    >
      { !isHidden && (
        <>
          <Script strategy="lazyOnload" src="https://coinzillatag.com/lib/display.js"/>
          <div className="coinzilla" data-zone="C-26660bf627543e46851"></div>
        </>
      ) }
    </Flex>
  );
};

export default chakra(CoinzillaBanner);
