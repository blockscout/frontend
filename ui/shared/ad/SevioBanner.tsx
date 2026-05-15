// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, chakra } from '@chakra-ui/react';
import Script from 'next/script';
import React from 'react';

import type { BannerProps } from './types';

import useIsMobile from 'client/shared/hooks/useIsMobile';

import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';
import { isBrowser } from 'toolkit/utils/isBrowser';

import {
  DESKTOP_BANNER_WIDTH,
  MOBILE_BANNER_WIDTH,
  DESKTOP_BANNER_HEIGHT,
  MOBILE_BANNER_HEIGHT,
} from './consts';

const adsBannerFeature = config.features.adsBanner;

const SevioBanner = ({ className, format = 'responsive' }: BannerProps) => {
  const isInBrowser = isBrowser();
  const isMobileViewport = useIsMobile();
  const { cspNonce } = useAppContext();
  const isMobile = format === 'mobile' || (format === 'responsive' && isMobileViewport);

  const { width, height } = (() => {
    if (isMobile) {
      return { width: MOBILE_BANNER_WIDTH, height: MOBILE_BANNER_HEIGHT };
    }
    return { width: DESKTOP_BANNER_WIDTH, height: DESKTOP_BANNER_HEIGHT };
  })();

  const sevio = adsBannerFeature.isEnabled && 'sevio' in adsBannerFeature ? adsBannerFeature.sevio : null;

  let zone = '';
  if (sevio) {
    zone = isMobile ? sevio.zoneMobile : sevio.zoneDesktop;
  }

  React.useEffect(() => {
    if (!isInBrowser || !sevio) {
      return;
    }

    const { adType, inventoryId, accountId } = sevio;
    window.sevioads = window.sevioads || [];
    window.sevioads.push([ { zone, adType, inventoryId, accountId } ]);
  }, [ isInBrowser, sevio, zone ]);

  if (!sevio) {
    return null;
  }

  return (
    <Flex
      className={ className }
      id={ 'adBanner' + (format ? `_${ format }` : '') }
      h={ height ? `${ height }px` : { base: `${ MOBILE_BANNER_HEIGHT }px`, lg: `${ DESKTOP_BANNER_HEIGHT }px` } }
      w={ width ? `${ width }px` : undefined }
    >
      <Script strategy="lazyOnload" nonce={ cspNonce ?? undefined } src="https://cdn.adx.ws/scripts/loader.js"/>
      <div className="sevioads" data-zone={ zone }></div>
    </Flex>
  );
};

export default chakra(SevioBanner);
