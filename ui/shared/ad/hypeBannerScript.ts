import config from 'configs/app';

export const hypeInit = (() => {
  const feature = config.features.adsBanner;

  if (!feature.isEnabled || feature.provider !== 'hype') {
    return;
  }

  return `!(function (h, y, p, e, l, a, b) {
    ((l = document.createElement(h)).async = !0),
      (l.src = y),
      (l.onload = function () {
        (a = { URL: p, propertySlug: e, environment: 'development' }), HypeLab.initialize(a);
      }),
      (b = document.getElementsByTagName(h)[0]).parentNode.insertBefore(l, b);
  })('script', 'https://api.hypelab.com/v1/scripts/hp-sdk.js?v=0', 'https://api.hypelab-staging.com', 'baaded78c2');`;
})();
