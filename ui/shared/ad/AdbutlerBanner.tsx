/* eslint-disable max-len */
import { Flex, chakra } from '@chakra-ui/react';
import Script from 'next/script';
import React from 'react';

const scriptText1 = `if (!window.AdButler){(function(){var s = document.createElement("script"); s.async = true; s.type = "text/javascript";s.src = 'https://servedbyadbutler.com/app.js';var n = document.getElementsByTagName("script")[0]; n.parentNode.insertBefore(s, n);}());}`;
const scriptText2 = `
var AdButler = AdButler || {}; AdButler.ads = AdButler.ads || [];
  var abkw = window.abkw || '';
  const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
  if (isMobile) {
      var plc539876 = window.plc539876 || 0;
      document.getElementById('ad-banner').innerHTML += '<'+'div id="placement_539876_'+plc539876+'"></'+'div>';
      document.getElementById("ad-banner").className = "ad-container mb-3";
      AdButler.ads.push({handler: function(opt){ AdButler.register(182226, 539876, [320,100], 'placement_539876_'+opt.place, opt); }, opt: { place: plc539876++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});
  } else {
      var plc523705 = window.plc523705 || 0;
      document.getElementById('ad-banner').innerHTML += '<'+'div id="placement_523705_'+plc523705+'"></'+'div>';
      AdButler.ads.push({handler: function(opt){ AdButler.register(182226, 523705, [728,90], 'placement_523705_'+opt.place, opt); }, opt: { place: plc523705++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});
  }
`;

const AdbutlerBanner = ({ className }: { className?: string }) => {
  return (
    <Flex className={ className } id="adBanner" h={{ base: '100px', lg: '90px' }}>
      <div id="ad-banner"></div>
      <Script id="ad-butler-1">{ scriptText1 }</Script>
      <Script id="ad-butler-2">{ scriptText2 }</Script>
    </Flex>
  );
};

export default chakra(AdbutlerBanner);
