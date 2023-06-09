/* eslint-disable max-len */
import appConfig from 'configs/app/config';

export const connectAdbutler = `if (!window.AdButler){(function(){var s = document.createElement("script"); s.async = true; s.type = "text/javascript";s.src = 'https://servedbyadbutler.com/app.js';var n = document.getElementsByTagName("script")[0]; n.parentNode.insertBefore(s, n);}());}`;

export const placeAd = `
var AdButler = AdButler || {}; AdButler.ads = AdButler.ads || [];
  var abkw = window.abkw || '';
  const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
  if (isMobile) {
      var plc${ appConfig.ad.adButlerConfigMobile?.id } = window.plc${ appConfig.ad.adButlerConfigMobile?.id } || 0;
      document.getElementById('ad-banner').innerHTML += '<'+'div id="placement_${ appConfig.ad.adButlerConfigMobile?.id }_'+plc${ appConfig.ad.adButlerConfigMobile?.id }+'"></'+'div>';
      document.getElementById("ad-banner").className = "ad-container mb-3";
      AdButler.ads.push({handler: function(opt){ AdButler.register(182226, ${ appConfig.ad.adButlerConfigMobile?.id }, [${ appConfig.ad.adButlerConfigMobile?.width },${ appConfig.ad.adButlerConfigMobile?.height }], 'placement_${ appConfig.ad.adButlerConfigMobile?.id }_'+opt.place, opt); }, opt: { place: plc${ appConfig.ad.adButlerConfigMobile?.id }++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});
  } else {
      var plc${ appConfig.ad.adButlerConfigDesktop?.id } = window.plc${ appConfig.ad.adButlerConfigDesktop?.id } || 0;
      document.getElementById('ad-banner').innerHTML += '<'+'div id="placement_${ appConfig.ad.adButlerConfigDesktop?.id }_'+plc${ appConfig.ad.adButlerConfigDesktop?.id }+'"></'+'div>';
      AdButler.ads.push({handler: function(opt){ AdButler.register(182226, ${ appConfig.ad.adButlerConfigDesktop?.id }, [${ appConfig.ad.adButlerConfigDesktop?.width },${ appConfig.ad.adButlerConfigDesktop?.height }], 'placement_${ appConfig.ad.adButlerConfigDesktop?.id }_'+opt.place, opt); }, opt: { place: plc${ appConfig.ad.adButlerConfigDesktop?.id }++, keywords: abkw, domain: 'servedbyadbutler.com', click:'CLICK_MACRO_PLACEHOLDER' }});
  }
`;
