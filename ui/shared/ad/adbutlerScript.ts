/* eslint-disable max-len */
import appConfig from 'configs/app/config';

export const connectAdbutler = `if (!window.AdButler){(function(){var s = document.createElement("script"); s.async = true; s.type = "text/javascript";s.src = 'https://servedbyadbutler.com/app.js';var n = document.getElementsByTagName("script")[0]; n.parentNode.insertBefore(s, n);}());}`;

export const placeAd = `
var AdButler = AdButler || {}; AdButler.ads = AdButler.ads || [];
  var abkw = window.abkw || '';
  const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
  if (isMobile) {
      var plc${ appConfig.ad.adButlerIdMobile } = window.plc${ appConfig.ad.adButlerIdMobile } || 0;
      document.getElementById('ad-banner').innerHTML += '<'+'div id="placement_${ appConfig.ad.adButlerIdMobile }_'+plc${ appConfig.ad.adButlerIdMobile }+'"></'+'div>';
      document.getElementById("ad-banner").className = "ad-container mb-3";
      AdButler.ads.push({handler: function(opt){ AdButler.register(182226, ${ appConfig.ad.adButlerIdMobile }, [320,100], 'placement_${ appConfig.ad.adButlerIdMobile }_'+opt.place, opt); }, opt: { place: plc${ appConfig.ad.adButlerIdMobile }++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});
  } else {
      var plc${ appConfig.ad.adButlerIdDesktop } = window.plc${ appConfig.ad.adButlerIdDesktop } || 0;
      document.getElementById('ad-banner').innerHTML += '<'+'div id="placement_${ appConfig.ad.adButlerIdDesktop }_'+plc${ appConfig.ad.adButlerIdDesktop }+'"></'+'div>';
      AdButler.ads.push({handler: function(opt){ AdButler.register(182226, ${ appConfig.ad.adButlerIdDesktop }, [728,90], 'placement_${ appConfig.ad.adButlerIdDesktop }_'+opt.place, opt); }, opt: { place: plc${ appConfig.ad.adButlerIdDesktop }++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});
  }
`;
