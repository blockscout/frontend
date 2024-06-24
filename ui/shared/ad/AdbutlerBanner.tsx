import { Flex, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import React from 'react';

import type { BannerProps } from './types';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import isBrowser from 'lib/isBrowser';
import { connectAdbutler, placeAd, ADBUTLER_ACCOUNT } from 'ui/shared/ad/adbutlerScript';

const feature = config.features.adsBanner;

const AdbutlerBanner = ({ className, platform }: BannerProps) => {
  const router = useRouter();
  const isMobileViewport = useIsMobile();
  const isMobile = platform === 'mobile' || isMobileViewport;

  const height = (() => {
    switch (platform) {
      case 'desktop':
        return '90px';
      case 'mobile':
        return '100px';
      default:
        return { base: '100px', lg: '90px' };
    }
  })();

  React.useEffect(() => {
    if (!('adButler' in feature)) {
      return;
    }

    if (isBrowser() && window.AdButler) {
      const abkw = window.abkw || '';
      if (!window.AdButler.ads) {
        window.AdButler.ads = [];
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore:
      let plc = window[`plc${ feature.adButler.config.mobile.id }`] || 0;
      const adButlerConfig = isMobile ? feature.adButler.config.mobile : feature.adButler.config.desktop;
      const banner = document.getElementById('ad-banner');
      if (banner) {
        banner.innerHTML = '<' + 'div id="placement_' + adButlerConfig?.id + '_' + plc + '"></' + 'div>';
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore:
      window.AdButler.ads.push({ handler: function(opt) {
        window.AdButler.register(
          ADBUTLER_ACCOUNT,
          adButlerConfig.id,
          [ adButlerConfig.width, adButlerConfig.height ],
          `placement_${ adButlerConfig.id }_` + opt.place,
          opt,
        );
      }, opt: { place: plc++, keywords: abkw, domain: 'servedbyadbutler.com', click: 'CLICK_MACRO_PLACEHOLDER' } });
    }
  }, [ router, isMobile ]);

  return (
    <Flex className={ className } id="adBanner" h={ height }>
      <Script strategy="lazyOnload" id="ad-butler-1">{ connectAdbutler }</Script>
      <Script strategy="lazyOnload" id="ad-butler-2">{ placeAd(platform) }</Script>
      <div id="ad-banner"></div>
    </Flex>
  );
};

export default chakra(AdbutlerBanner);
