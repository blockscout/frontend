import { Flex, chakra } from '@chakra-ui/react';
import Script from 'next/script';
import React from 'react';

import type { BannerProps } from './types';

import useIsMobile from 'lib/hooks/useIsMobile';
import { isBrowser } from 'toolkit/utils/isBrowser';

import {
  DESKTOP_BANNER_WIDTH,
  MOBILE_BANNER_WIDTH,
  DESKTOP_BANNER_HEIGHT,
  MOBILE_BANNER_HEIGHT,
} from './consts';

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
        return { width: DESKTOP_BANNER_WIDTH, height: DESKTOP_BANNER_HEIGHT };
      case 'mobile':
        return { width: MOBILE_BANNER_WIDTH, height: MOBILE_BANNER_HEIGHT };
      default:
        return { width: undefined, height: undefined };
    }

  })();

  React.useEffect(() => {
    if (isInBrowser && !isHidden) {
      window.coinzilla_display = window.coinzilla_display || [];
      const cDisplayPreferences = {
        zone: '26660bf627543e46851',
        width: width ? String(width) : DESKTOP_BANNER_WIDTH.toString(),
        height: height ? String(height) : DESKTOP_BANNER_HEIGHT.toString(),
      };
      window.coinzilla_display.push(cDisplayPreferences);
    }
  }, [ isInBrowser, isHidden, platform, width, height ]);

  return (
    <Flex
      className={ className }
      id={ 'adBanner' + (platform ? `_${ platform }` : '') }
      h={ height ? `${ height }px` : { base: `${ MOBILE_BANNER_HEIGHT }px`, lg: `${ DESKTOP_BANNER_HEIGHT }px` } }
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
