import { Flex, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import React from 'react';

import appConfig from 'configs/app/config';
import useIsMobile from 'lib/hooks/useIsMobile';
import isBrowser from 'lib/isBrowser';
import { connectAdbutler, placeAd, ADBUTLER_ACCOUNT } from 'ui/shared/ad/adbutlerScript';

const AdbutlerBanner = ({ className }: { className?: string }) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  React.useEffect(() => {
    if (isBrowser() && window.AdButler) {
      const abkw = window.abkw || '';
      if (!window.AdButler.ads) {
        window.AdButler.ads = [];
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore:
      let plc = window[`plc${ appConfig.ad.adButlerConfigMobile?.id }`] || 0;
      const config = isMobile ? appConfig.ad.adButlerConfigMobile : appConfig.ad.adButlerConfigDesktop;
      const banner = document.getElementById('ad-banner');
      if (banner) {
        banner.innerHTML = '<' + 'div id="placement_' + config?.id + '_' + plc + '"></' + 'div>';
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore:
      window.AdButler.ads.push({ handler: function(opt) {
        window.AdButler.register(ADBUTLER_ACCOUNT, config?.id, [ config?.width, config?.height ], `placement_${ config?.id }_` + opt.place, opt);
      }, opt: { place: plc++, keywords: abkw, domain: 'servedbyadbutler.com', click: 'CLICK_MACRO_PLACEHOLDER' } });
    }
  }, [ router, isMobile ]);

  return (
    <Flex className={ className } id="adBanner" h={{ base: '100px', lg: '90px' }}>
      <Script id="ad-butler-1">{ connectAdbutler }</Script>
      <Script id="ad-butler-2">{ placeAd }</Script>
      <div id="ad-banner"></div>
    </Flex>
  );
};

export default chakra(AdbutlerBanner);
